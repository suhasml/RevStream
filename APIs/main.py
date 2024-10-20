from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import AsyncIterable
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
import asyncio
from datetime import datetime, timedelta
from chatbot import ChatAgent
import os
from dotenv import load_dotenv
import pandas as pd
from pydantic import BaseModel, Field
from typing import List, Dict
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from upstash_redis.asyncio import Redis
import json
import requests
import instaloader
from bs4 import BeautifulSoup
import re
from starlette.concurrency import run_in_threadpool 

load_dotenv()

app = FastAPI()

redis = Redis(url=os.getenv("UPSTASH_REDIS_REST_URL"), token=os.getenv("UPSTASH_REDIS_REST_TOKEN"))
# MongoDB connection
MONGO_URI = os.getenv("MONGO_CONNECTION_URL")
client = MongoClient(MONGO_URI)
db = client['hackfinals']
room_service_collection = db['room_service']
food_orders_collection = db['food_orders']  # New collection for food orders
hosted_events_collection = db['hosted_events']  # New collection for hosted events
requested_events_collection = db['requested_events']  # New collection for requested events


# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

# Pydantic model for room service booking
class RoomServiceBooking(BaseModel):
    room_number: str
    service_type: str
    date: str
    time: str

# Pydantic model for food orders
class FoodOrder(BaseModel):
    room_number: str
    items: str

class AgentMessage(BaseModel):
    message: str
    session_id: str

# Pydantic model for hosted event
class HostedEvent(BaseModel):
    title: str
    date: str
    description: str
    details: list[str]

# Pydantic model for requested event
class Request(BaseModel):
    session_id: str


# Helper to serialize MongoDB objects
def serialize_mongo_obj(obj):
    obj["id"] = str(obj["_id"])
    del obj["_id"]
    return obj

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

class InstagramPost(BaseModel):
    shortcode: str
    display_url: str
    likes: int
    comments: int
    caption: str
    timestamp: str


class SMECampaign(BaseModel):
    title: str
    description: str

class NewSMECampaign(BaseModel):
    title: str
    description: str
    hashtag: str



# New collection for SME campaigns
sme_campaigns_collection = db['sme_campaigns']

L = instaloader.Instaloader()

# @app.get("/search-instagram", response_model=List[InstagramPost])
# async def search_instagram(tag: str):
#     try:
#         posts = []
#         hashtag = instaloader.Hashtag.from_name(L.context, tag)
#         print(f"Hashtag: {hashtag}")
        
#         for post in hashtag.get_top_posts():
#             posts.append(InstagramPost(
#                 shortcode=post.shortcode,
#                 display_url=post.url,
#                 likes=post.likes,
#                 comments=post.comments,
#                 caption=post.caption if post.caption else "",
#                 timestamp=post.date_local.isoformat()
#             ))
#             if len(posts) >= 5:
#                 break
        
#         return posts
#     except Exception as e:
#         print(e)
#         raise HTTPException(status_code=500, detail=f"Error fetching Instagram posts: {str(e)}")

@app.get("/search-instagram", response_model=List[InstagramPost])
async def search_instagram(tag: str):
    try:
        # Create a new list to store posts
        posts = []
        
        # Run blocking operation in a threadpool
        hashtag = await run_in_threadpool(instaloader.Hashtag.from_name, L.context, tag)
        
        # Iterate over the top posts of the hashtag
        async for post in run_in_threadpool(hashtag.get_top_posts):
            posts.append(InstagramPost(
                shortcode=post.shortcode,
                display_url=post.url,
                likes=post.likes,
                comments=post.comments,
                caption=post.caption if post.caption else "",
                timestamp=post.date_local.isoformat()
            ))

            # Limit the number of posts to 5
            if len(posts) >= 5:
                break
        
        return posts

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error fetching Instagram posts: {str(e)}")

@app.get("/ongoing-sme-campaigns")
async def get_ongoing_sme_campaigns():
    try:
        campaigns = list(sme_campaigns_collection.find({}))
        return [serialize_mongo_obj(campaign) for campaign in campaigns]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching ongoing SME campaigns: {str(e)}")
    
@app.delete("/ongoing-sme-campaigns/{campaign_id}")
async def delete_ongoing_sme_campaign(campaign_id: str):
    try:
        result = sme_campaigns_collection.delete_one({"_id": ObjectId(campaign_id)})
        if result.deleted_count == 1:
            return {"message": "SME campaign deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="SME campaign not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete SME campaign: {str(e)}")

@app.post("/launch-sme-campaign")
async def launch_sme_campaign(campaign: NewSMECampaign):
    try:
        data = {
            "title": campaign.title,
            "description": campaign.description,
            "hashtag": campaign.hashtag
        }
        result = sme_campaigns_collection.insert_one(data)
        new_campaign = sme_campaigns_collection.find_one({"_id": result.inserted_id})
        return NewSMECampaign(**new_campaign)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error launching SME campaign: {str(e)}")
    
# Endpoint to get room services
@app.get("/get-room-services")
async def get_room_services():
    services = room_service_collection.find()
    return [serialize_mongo_obj(service) for service in services]

# Endpoint to get food orders
@app.get("/get-food-orders")
async def get_food_orders():
    orders = food_orders_collection.find()
    return [serialize_mongo_obj(order) for order in orders]

@app.post("/host-event")
async def host_event(event: HostedEvent):
    try:
        # Insert the event into the database
        data = {
            "title": event.title,
            "date": event.date,
            "description": event.description,
            "details": event.details
        }
        result = hosted_events_collection.insert_one(data)
        
        # Return the inserted ID as confirmation
        return {"message": "Event hosted successfully", "id": str(result.inserted_id)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to host event: {str(e)}")

# Fetch hosted events
@app.get("/hosted-events")
async def get_hosted_events():
    try:
        hosted_events = list(hosted_events_collection.find({}))  # Exclude MongoDB's internal '_id' 
        hosted_events = [serialize_mongo_obj(event) for event in hosted_events]
        return hosted_events
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching hosted events")
    
# Delete an event from hosted events
@app.delete("/hosted-events/{event_id}")
async def delete_hosted_event(event_id: str):
    try:
        result = hosted_events_collection.delete_one({"_id": ObjectId(event_id)})
        if result.deleted_count == 1:
            return {"message": "Hosted event deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Hosted event not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete hosted event: {str(e)}")


# Request an event
@app.post("/request-event")
async def request_event(event: HostedEvent):
    try:
        # Insert the event into the database
        data = {
            "title": event.title,
            "date": event.date,
            "description": event.description,
            "details": event.details
        }
        result = requested_events_collection.insert_one(data)
        
        # Return the inserted ID as confirmation
        return {"message": "Event requested successfully", "id": str(result.inserted_id)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to request event: {str(e)}")
    
# Fetch requested events
@app.get("/requested-events")
async def get_requested_events():
    try:
        requested_events = list(requested_events_collection.find({}))  # Exclude MongoDB's internal '_id'
        requested_events = [serialize_mongo_obj(event) for event in requested_events]
        return requested_events
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching requested events")

# Delete an event from requested events
@app.delete("/requested-events/{event_id}")
async def delete_requested_event(event_id: str):
    try:
        result = requested_events_collection.delete_one({"_id": ObjectId(event_id)})
        if result.deleted_count == 1:
            return {"message": "Requested event deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Requested event not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete requested event: {str(e)}")

class VisitorInfo(BaseModel):
    name: str
    email: str
    visit_dates: List[str]

@app.get("/frequent-visitors", response_model=List[VisitorInfo])
async def get_frequent_visitors():
    # Group by name and count visits
    booking_df = pd.read_csv("booking_data.csv")
    visit_counts = booking_df.groupby('name').size()
    booking_df['visit_date'] = pd.to_datetime(booking_df['visit_date'])

    # Filter for visitors with more than 3 visits
    frequent_visitors = visit_counts[visit_counts > 3].index.tolist()
    
    result = []
    for visitor in frequent_visitors:
        visitor_data = booking_df[booking_df['name'] == visitor]
        result.append(VisitorInfo(
            name=visitor,
            email=visitor_data['email'].iloc[0],  # Assume email is consistent for the same name
            visit_dates=visitor_data['visit_date'].dt.strftime('%Y-%m-%d').tolist()
        ))
     
    print(result)
    
    return result

#Endpoint for chatbot:
@app.post("/chatbot")
async def chatbot(request: AgentMessage):
    try:
        async def get_response() -> AsyncIterable[str]:
            chat_agent = ChatAgent()
            task = asyncio.create_task(chat_agent.run_bot(request.message, request.session_id))
            queue = asyncio.Queue()

            async def agent_callback():
                try:
                    answer = await task
                    await queue.put(answer)
                except Exception as e:
                    await queue.put({"error": str(e)})
                finally:
                    await queue.put(None)

            asyncio.create_task(agent_callback())

            while True:
                try:
                    response = await asyncio.wait_for(queue.get(), timeout=2)
                    if response is None:
                        break
                    if "error" in response:
                        raise HTTPException(status_code=500, detail=response["error"])
                    
                    async for message in response["answer"]:
                        print(f"Message: {message}")
                        if isinstance(message, dict):
                            if "content" in message and message["content"]:
                                yield message["content"]
                            if "output" in message and message["output"]:
                                yield message["output"]

                    break
                except asyncio.TimeoutError:
                    await asyncio.sleep(1)  

        return StreamingResponse(get_response(), media_type="text/event-stream")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/gigs")
async def gigs(request: Request):
    try:
        # Get session_id from the frontend request
        
        session_id = request.session_id
        print(session_id)
        # Check if the session ID exists in the Redis cache
        cached_data = await redis.get(session_id)
        if cached_data:
            print("Returning cached response")
            return json.loads(cached_data)

        # Continue if there's no cached data
        df = pd.read_csv("Hotel_dataset_modified.csv")
        current_date = datetime.now()
        next_month = (current_date.replace(day=1) + timedelta(days=32)).replace(day=1)
        df['arrival_datetime'] = pd.to_datetime(df['arrival_datetime'])

        next_month_bookings = df[(df['arrival_datetime'] >= next_month) & (df['arrival_datetime'] < next_month + pd.DateOffset(months=1))]
        # next_month_data = next_month_bookings.to_dict(orient='records')
        next_month_bookings = next_month_bookings[:25]  # Limit to 25 bookings

        class Gigs(BaseModel):
            artists: list = Field(description="A list of artists that can host events during the period")
            events: list = Field(description="A list of events that can be hosted during the period")

        llm = ChatOpenAI(api_key=os.getenv('OPENAI_API_KEY'), model='gpt-4o-mini')
        llm_with_tool = llm.with_structured_output(Gigs)

        prompt = PromptTemplate(
            template=
        """Here is the list of bookings for the next month: {next_month_data}.
        Based on the bookings, can you provide the following:

        1. A list of artists who can host events during the period, including their name, occupation, and the date of arrival. Inclue only [
            'Musician', 'Dancer', 'Singer', 'Comedian', 'Magician', 'Pianist', 'Guitarist'
        ] as the occupation.
        2. A list of events that can be hosted during the period, based on the artists that are coming and the possible dates of when the events can be hosted. Include they keys 'artist', 'event', 'description' and 'date' in the response.

        Please give suggestions based on the number of guests and their market segment (e.g., direct, corporate, group bookings).""",
            input_variables=["next_month_data"]
        )

        chain = prompt | llm_with_tool
        results = chain.invoke({"next_month_data": next_month_bookings})
        artists = results.artists
        events = results.events

        response_data = {"artists": artists, "events": events}

        # Store the result in the Redis cache with session_id as key, set expiry time to 1 hour
        await redis.set(session_id, json.dumps(response_data), ex=3600)  # Cache for 1 hour
        print("Storing new response in cache")

        return response_data

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
           
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
