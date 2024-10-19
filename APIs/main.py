from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import AsyncIterable
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
import asyncio
from chatbot import ChatAgent
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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
        hosted_events = list(hosted_events_collection.find({}, {'_id': 0}))  # Exclude MongoDB's internal '_id'
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
        requested_events = list(requested_events_collection.find({}, {'_id': 0}))  # Exclude MongoDB's internal '_id'
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




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
