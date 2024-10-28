import os
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_huggingface import HuggingFaceEmbeddings
from prompts import hotel_agent_prompt
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import AIMessageChunk, AIMessage
from langgraph.graph import StateGraph, END
from typing import List, AsyncGenerator
from datetime import datetime
from pydantic import BaseModel, Field
from typing_extensions import TypedDict
from pymongo import MongoClient
from langchain_community.chat_message_histories.upstash_redis import (
    UpstashRedisChatMessageHistory,
)
from langchain_core.tools import tool
from langchain.agents import AgentExecutor, create_tool_calling_agent
from dotenv import load_dotenv

load_dotenv()

class ChatAgent:
    def __init__(self, hotel_agent_prompt=hotel_agent_prompt):
        self.hotel_agent_prompt = hotel_agent_prompt
        embedding_function = HuggingFaceEmbeddings(model_name="thenlper/gte-small")       
        self.db = FAISS.load_local("lyf_faiss_db", embeddings=embedding_function, allow_dangerous_deserialization=True)
        
        self.llm = ChatOpenAI(model_name='gpt-4o-mini',
                              openai_api_key=os.getenv("OPENAI_API_KEY"),
                              temperature=0)

        # self.session_id = session_id
        self.mongo_connection_url = os.getenv("MONGO_CONNECTION_URL")
        # MongoDB connection
        if self.mongo_connection_url is None:
            raise ValueError("MongoDB connection URL is required")
        
        self.mongo_client = MongoClient(self.mongo_connection_url)
        self.hotel_db = self.mongo_client['hackfinals']
        self.room_service_collection = self.hotel_db['room_service']
        self.food_orders_collection = self.hotel_db['food_orders']
        

    async def run_bot(self, query, session_id=None):
        history = UpstashRedisChatMessageHistory(
            url=os.getenv("UPSTASH_REDIS_REST_URL"),
            token=os.getenv("UPSTASH_REDIS_REST_TOKEN"),
            session_id=session_id,
        )

        history.add_user_message(query)
        chat_history = history.messages
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", self.hotel_agent_prompt),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "Question : {input}, Agent scratchpad: {agent_scratchpad}"),
            ]
        )
        retriever = self.db.as_retriever(search_type="similarity", search_kwargs={"k": 7})
        
        @tool
        def book_room_service(room_number: str, service_type: str, date: datetime, time: str) -> str:
            """Book room service for a hotel guest"""
            booking = {
                "room_number": room_number,
                "service_type": service_type,
                "date": date,
                "time": time
            }
            result = self.room_service_collection.insert_one(booking)
            if result:
                return f"Room service booked successfully. Booking ID: {str(result.inserted_id)}"
            else:
                return "Failed to book room service"
            
        @tool
        def order_food(room_number: str, items: str) -> str:
            """Place a food order for a hotel guest"""
            order = {
                "room_number": room_number,
                "items": items
            }
            result = self.food_orders_collection.insert_one(order)
            if result:
                return f"Food order placed successfully. Order ID: {str(result.inserted_id)}"
            else:
                return "Failed to place food order"
            

        @tool
        def get_freelancers(query: str) -> List[str]:
            """Get freelancers from the database"""
            embedding = OpenAIEmbeddings()
            query_embedding = embedding.embed_query(query)
            db = self.mongo_client['hackfinals']
            collection = db['freelancers']  # Replace with your collection name.
        
        # Query for similar documents using the aggregation framework
            pipeline = [
                {
                    "$vectorSearch": {
                        "queryVector": query_embedding,
                        "path": "embeddings",
                        "numCandidates": 100,
                        "limit": 5,
                        "index": "freelancers_index"
                    }
                }
            ]
            documents = list(collection.aggregate(pipeline))
            return documents

        tools = [book_room_service, order_food, get_freelancers]
        agent = create_tool_calling_agent(self.llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools)

        # Graph State
        class GraphState(TypedDict):
            session_id: str
            question: str
            answer: str
            documents: List[str]
            conversation_ended: bool
            session_id: str
            datetime: bool 


        def retrieve(state):
            question = state["question"]
            prompt = ChatPromptTemplate.from_messages([
                MessagesPlaceholder(variable_name="chat_history"),
                ("user", """
                You are a hotel customer service representative. You have been asked a question by a guest.
                Given the conversation history, generate a search query to look up relevant information from your knowledge base.
                Only provide the search query and no other text.

                User Question: {input}
                """)
            ])
            llm = prompt | self.llm
            try:
                query = llm.invoke({"input": question, "chat_history": chat_history})
                query = query.content
            except Exception as e:
                print(e)
                raise e
            print(f"Search Query: {query}")

            documents = retriever.invoke(query)
            state['conversation_ended'] = False
            return {"documents": documents, "question": question, "conversation_ended": state["conversation_ended"]}

        async def generate(state):
            question = state["question"]
            documents = state["documents"]
            print("Inside generate")
            full_response = ''

            async def stream_response() -> AsyncGenerator[AIMessageChunk, None]:
                nonlocal full_response
                try:
                    async for chunk in agent_executor.astream({"input": question, "context": documents, "chat_history": chat_history}):
                        print("Chunk", chunk)
                        full_response += chunk['output']
                        yield chunk
                # response = agent_executor.invoke({"input": question, 
                #                     "context": documents, 
                #                     "chat_history": chat_history})
                # generation = response["output"]
                    history.add_ai_message(full_response)
                except Exception as e:
                    print(e)
                    raise e
            
            state["conversation_ended"] = False
            # return {"documents": documents, "question": question, "generation": generation, "session_id": state["session_id"], "conversation_ended": state["conversation_ended"]}
            return {"documents": documents, "question": question, "session_id": state["session_id"], "conversation_ended": state["conversation_ended"], "answer": stream_response()}
        
    
        def is_conversation_over(state):
            class grade(BaseModel):
                binary_score: str = Field(description="Relevance score 'yes' or 'no'")

            llm_with_tool = self.llm.with_structured_output(grade)

            prompt = PromptTemplate(
                template="""You are tasked with determining whether the conversation is over or not.
                Please provide a binary score of 'yes' or 'no' based on the conversation history provided.
                Analyze both the AIMessage and HumanMessage in the conversation history to determine if the conversation is over or not.
                'yes' if the conversation is over and 'no' if the conversation is not over.
                If the conversation is restarted then do not stop the conversation. You have to decide if the conversation is over or not and if it is restarted then you have to continue the conversation.
                Conversation History: {conversation}""",
                input_variables=["conversation"],
            )

            chain = prompt | llm_with_tool

            # conversation = self.memory.chat_memory.messages[-5:] if len(self.memory.chat_memory.messages) > 5 else self.memory.chat_memory.messages
            conversation = history.messages[-5:] if len(history.messages) > 5 else history.messages
            scored_result = chain.invoke({"conversation": conversation})

            score = scored_result.binary_score

            if score == "yes":
                return "save_chat"
            else:
                state["conversation_ended"] = False
                return END

        def save_chat(state):
            # with open(f"conversation_history_{state['session_id']}.txt", "w", encoding="utf-8") as file:
            #     for message in history.messages:
            #         file.write(f"{message}\n")
            state["conversation_ended"] = True

            prompt = ChatPromptTemplate.from_messages([
                MessagesPlaceholder(variable_name="chat_history"),
                ("user", """
                You are tasked with saying the end message of the conversation.
                Given the conversation history, generate the end message of the conversation.
                It can be something like "Thank you for using our service. Have a great day!\n Is there anything else I can help you with?"
                Does not have to be exactly like that but should be a good end message.

                User Question: {input}
                """)
            ])
            llm = prompt | self.llm
            full_response = ''
            async def stream_response() -> AsyncGenerator[AIMessageChunk, None]:
                nonlocal full_response
                try:
                    async for chunk in llm.astream({"input": "end conversation", "chat_history": chat_history}):
                        if isinstance(chunk, AIMessageChunk):
                            full_response += chunk.content
                            print(f"Chunk: {chunk}")
                            yield chunk
                        else:
                            print(f"Unknown chunk type: {chunk}")
                    history.add_ai_message(full_response)
                except Exception as e:
                    print(e)
                    raise e


            # query = llm.invoke({"input": state['question'], "chat_history": chat_history})
            # generation = query.content
            # history.add_ai_message(generation)
            # self.memory.clear()
            # return {"generation": generation, "conversation_ended": state["conversation_ended"], "documents": state["documents"], "session_id": state["session_id"]}
            return {"answer": stream_response(), "conversation_ended": state["conversation_ended"], "documents": state["documents"], "session_id": state["session_id"]}

        workflow = StateGraph(GraphState)
        workflow.add_node("retrieve", retrieve)
        workflow.add_node("generate", generate)
        workflow.add_node("save_chat", save_chat)
       
        workflow.set_entry_point("retrieve")
        workflow.add_edge("retrieve", "generate")
        workflow.add_conditional_edges("generate", is_conversation_over)
        # workflow.add_conditional_edges("generate", check_tool_call)
        # workflow.add_edge("book_room_service", "save_chat")
        # workflow.add_edge("order_food", "save_chat")
        
        # workflow = StateGraph(GraphState)
        # workflow.add_node("generate", generate)
        # workflow.add_node("save_chat", save_chat)
        # workflow.set_entry_point("generate")
        # workflow.add_conditional_edges("generate", is_conversation_over)

        app = workflow.compile()
        inputs = {"question": query, "session_id": session_id}
        async for output in app.astream(inputs):
            for key, value in output.items():
                if key == "answer":
                    return value
        return {
            "answer": value["answer"],
            "conversation_ended": value["conversation_ended"],
            "documents": value["documents"],
            "session_id": value["session_id"],
        }