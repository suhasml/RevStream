from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, PlainTextResponse
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
import instaloader
from bs4 import BeautifulSoup
from chat2plot import chat2plot
from starlette.concurrency import run_in_threadpool 
import random
import string

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
sponsored_packages_collection = db['sponsored_packages']  # New collection for sponsored packages
# Custom Package Requests   
custom_package_requests = db['custom_package_requests']  # New collection for custom package requests
packages = db['packages']  # New collection for packages
targeted_ads = db['targeted_ads_campaigns']  # New collection for targeted ads campaigns
freelancers = db['freelancers']  # New collection for freelancers

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

# Pydantic model for package
class PackageBase(BaseModel):
    title: str
    description: str
    price: float
    duration: str

class Package(PackageBase):
    id: str

# Pydantic model for sponsored package
class SponsoredPackageBase(BaseModel):
    title: str
    description: str
    price: float
    duration: int

class SponsoredPackage(SponsoredPackageBase):
    id: str

# Pydantic model for custom package request
class CustomPackageRequestBase(BaseModel):
    name: str
    desccription: str
    requests : str
    status: str


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

class TargetedAdsCampaign(BaseModel):
    title: str
    description: str
    target_audience: str
    start_date: str
    end_date: str
    budget: float

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
    

hotel_bookings_collection = db['hotel_bookings']

class PaymentConfirmation(BaseModel):
    email: str
    nameOnCard: str
    cardNumber: str
    expiry: str
    cvc: str
    address: str
    city: str
    state: str
    postalCode: str
    checkIn: str
    checkOut: str
    hotelName: str

def generate_confirmation_code():
    """Generate a random 6-digit confirmation code."""
    return ''.join(random.choices(string.digits, k=6))

@app.post("/payments/confirmation")
async def confirm_payment(payment_details: PaymentConfirmation):
    try:
        # Generate a unique confirmation code
        confirmation_code = generate_confirmation_code()

        
        # Keep generating until we get a unique code
        while hotel_bookings_collection.find_one({"confirmation_code": confirmation_code}):
            confirmation_code = generate_confirmation_code()
        
        # Create booking record
        booking_data = {
            "confirmation_code": confirmation_code,
            "email": payment_details.email,
            "hotel_name": payment_details.hotelName,
            "check_in": payment_details.checkIn,
            "check_out": payment_details.checkOut,
            "billing_address": {
                "address": payment_details.address,
                "city": payment_details.city,
                "state": payment_details.state,
                "postal_code": payment_details.postalCode
            },
            "booking_date": datetime.now(),
            "payment_status": "confirmed"
        }


        
        # Insert into database
        result = hotel_bookings_collection.insert_one(booking_data)
        
        if result.inserted_id:
            return {
                "status": "success",
                "confirmation_code": confirmation_code,
                "data": {
                    "booking_details": {
                        "hotel_name": payment_details.hotelName,
                        "check_in": payment_details.checkIn,
                        "check_out": payment_details.checkOut,
                        "email": payment_details.email
                    }
                },
                "errors": []
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create booking")
            
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    

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

# #Endpoint for chatbot:
# @app.post("/chatbot")
# async def chatbot(request: AgentMessage):
#     try:
#         async def get_response() -> AsyncIterable[str]:
#             chat_agent = ChatAgent()
#             task = asyncio.create_task(chat_agent.run_bot(request.message, request.session_id))
#             queue = asyncio.Queue()

#             async def agent_callback():
#                 try:
#                     answer = await task
#                     await queue.put(answer)
#                 except Exception as e:
#                     await queue.put({"error": str(e)})
#                 finally:
#                     await queue.put(None)

#             asyncio.create_task(agent_callback())

#             while True:
#                 try:
#                     response = await asyncio.wait_for(queue.get(), timeout=2)
#                     if response is None:
#                         break
#                     if "error" in response:
#                         raise HTTPException(status_code=500, detail=response["error"])
                    
#                     async for message in response["answer"]:
#                         print(f"Message: {message}")
#                         if isinstance(message, dict):
#                             if "content" in message and message["content"]:
#                                 yield message["content"]
#                             if "output" in message and message["output"]:
#                                 yield message["output"]

#                     break
#                 except asyncio.TimeoutError:
#                     await asyncio.sleep(1)  

#         return StreamingResponse(get_response(), media_type="text/event-stream")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot")
async def chatbot(request: AgentMessage):
    try:
        chat_agent = ChatAgent()
        response = await chat_agent.run_bot(request.message, request.session_id)
        
        # Collect all the response chunks into a single string
        full_response = ""
        async for chunk in response["answer"]:
            if isinstance(chunk, dict):
                if content := chunk.get("content"):
                    full_response += content
                elif output := chunk.get("output"):
                    full_response += output
            elif isinstance(chunk, str):
                full_response += chunk
        
        return PlainTextResponse(content=full_response)
        
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
        next_month_bookings = next_month_bookings[:50]  # Limit to 25 bookings

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
        await redis.set(session_id, json.dumps(response_data), ex=21600)
        print("Storing new response in cache")

        return response_data

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/partner-events")
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
        next_month_bookings = next_month_bookings[:50]  # Limit to 25 bookings

        partner_df = pd.read_csv("partners.csv")
        

        class Gigs(BaseModel):
            events: list = Field(description="A list of events that can be hosted during the period")

        llm = ChatOpenAI(api_key=os.getenv('OPENAI_API_KEY'), model='gpt-4o-mini')
        llm_with_tool = llm.with_structured_output(Gigs)

        prompt = PromptTemplate(
            template=
        """Here is the list of bookings for the next month: {next_month_data}.
            Here are the list of partners and the events that they are capable of hosting: {partner_data}
        Based on the people coming in, recommend the events that can be hosted by the partners. Give me:

        1. A list of events that can be hosted during the period, based on the people that are coming and the possible dates of when the events can be hosted. Include they keys 'event', 'description', 'partner', 'why' and 'date' in the response.

        Please give suggestions based on the number of guests and their market segment (e.g., direct, corporate, group bookings).""",
            input_variables=["next_month_data", "partner_data"]
        )

        chain = prompt | llm_with_tool
        results = chain.invoke({"next_month_data": next_month_bookings, "partner_data": partner_df.to_dict(orient='records')})
        events = results.events

        response_data = {"events": events}

        # Store the result in the Redis cache with session_id as key, set expiry time to 1 hour
        await redis.set(session_id, json.dumps(response_data), ex=21600)
        print("Storing new response in cache")

        return response_data

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/admin/packages")
async def get_packages():
    try:
        result = list(packages.find({}))
        print(result)
        return [serialize_mongo_obj(package) for package in result]
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error fetching packages: {str(e)}")

@app.post("/admin/packages", response_model=Package)
async def create_package(package: PackageBase):
    try:
        data = {
            "title": package.title,
            "description": package.description,
            "price": package.price,
            "duration": package.duration
        }
        result = packages.insert_one(data)
        new_package = packages.find_one({"_id": result.inserted_id})
        return serialize_mongo_obj(new_package)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating package: {str(e)}")

# Sponsored Packages
@app.get("/admin/sponsored-packages")
async def get_sponsored_packages():
    try:
        sponsored_packages = list(sponsored_packages_collection.find({}))
        return [serialize_mongo_obj(package) for package in sponsored_packages]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sponsored packages: {str(e)}")


@app.post("/admin/sponsored-packages")
async def create_sponsored_package(package: SponsoredPackageBase):
    try:
        data = {
            "title": package.title,
            "description": package.description,
            "price": package.price,
            "duration": package.duration
        }
        result = sponsored_packages_collection.insert_one(data)
        new_package = sponsored_packages_collection.find_one({"_id": result.inserted_id})
        return serialize_mongo_obj(new_package)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating sponsored package: {str(e)}")

# Custom Package Requests
@app.get("/admin/custom-package-requests")
async def get_custom_package_requests():
    try:
        requests = list(custom_package_requests.find({}))
        return [serialize_mongo_obj(request) for request in requests]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching custom package requests: {str(e)}")

@app.post("/admin/custom-package-requests")
async def create_custom_package_request(request: CustomPackageRequestBase):
    try:
        data = {
            "name": request.name,
            "description": request.description,
            "requests": request.requests,
            "status": request.status
        }
        result = custom_package_requests.insert_one(data)
        new_request = custom_package_requests.find_one({"_id": result.inserted_id})
        return serialize_mongo_obj(new_request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating custom package request: {str(e)}")
    
# Targeted Ads Campaigns
@app.get("/admin/targeted-ads")
async def get_targeted_ads_campaigns():
    try:
        campaigns = list(targeted_ads.find({}))
        return [serialize_mongo_obj(campaign) for campaign in campaigns]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching targeted ads campaigns: {str(e)}")
    
@app.post("/admin/targeted-ads")
async def create_targeted_ads_campaign(campaign: TargetedAdsCampaign):
    try:
        data = {
            "name": campaign.title,
            "description": campaign.description,
            "target_audience": campaign.target_audience,
            "start_date": campaign.start_date,
            "end_date": campaign.end_date,
            "budget": campaign.budget,
        }
        result = targeted_ads.insert_one(data)
        new_campaign = targeted_ads.find_one({"_id": result.inserted_id})
        return serialize_mongo_obj(new_campaign)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating targeted ads campaign: {str(e)}")
    
@app.get("/search-freelancers")
async def search_freelancers():
    try:
        freelancers_list = list(freelancers.find({}))
        return [serialize_mongo_obj(freelancer) for freelancer in freelancers_list]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching freelancers: {str(e)}")
    
df = pd.read_csv('reviews.csv')

# Initialize the LLM model
chat_model = ChatOpenAI(api_key=os.getenv('OPENAI_API_KEY'), model='gpt-4o-mini')

# Define a request model to take date range
class ChartRequest(BaseModel):
    time_range: str  # 'last_week', 'last_month', 'last_3_months'


# Helper function to generate plots using LLM
def generate_plot(df, query):
    current_date = datetime.now().strftime('%d/%m/%Y')
    response = chat2plot(df=df, chat=chat_model, language='English').query(
        query + f". The current date is {current_date}. Include a title and labels for the x and y axes."
    )
    if response.figure:
        return response.figure.to_json()
    else:
        raise HTTPException(status_code=400, detail="Could not generate the chart.")
    
class review_analysis(BaseModel):
    """Returns the analysis of the reviews."""
    review: str = Field(..., title="Review", description="The analysis of the positive and negative reviews given by the guests in 100-150 words.")
    painpoints: str = Field(..., title="Pain Points", description="The pain points identified in the reviews in bullet points.")
    areas_of_improvement: str = Field(..., title="Areas of Improvement", description="The areas of improvement identified in the reviews and based on the pain points in bullet points.")

# Helper function to filter data based on time range
def filter_data_by_date(df, time_range):
    current_date = datetime.now()
    if time_range == 'last_week':
        start_date = current_date - timedelta(weeks=1)
    elif time_range == 'last_month':
        start_date = current_date - timedelta(days=30)
    elif time_range == 'last_3_months':
        start_date = current_date - timedelta(days=90)
    else:
        raise HTTPException(status_code=400, detail="Invalid time range")
    
    df['VisitDate'] = pd.to_datetime(df['VisitDate'], errors='coerce')
    filtered_df = df[df['VisitDate'] >= start_date]
    return filtered_df

# Review analysis using LLM and structured output
def analyze_reviews(reviews):
    # Define the prompt
    prompt = PromptTemplate(
        template=""" 
        You will be given a list of reviews from the guests. Analyze the reviews and provide a summary of the positive and negative reviews given by the guests. \n
        Change the hotel to 'Lyf Funan Singapore' in the analysis. \n
        1. You should provide a summary of the reviews in 100-150 words.  \n
        2. Identify the pain points mentioned in the reviews. \n
        3. Identify the areas of improvement based on the pain points. \n
        Reviews: {reviews}
        """,
        input_variables=["reviews"]
    )
    
    llm_with_tool = chat_model.with_structured_output(review_analysis)
    
    # Chain the prompt and LLM model
    chain = prompt | llm_with_tool
    response = chain.invoke({"reviews": reviews})
    
    return {
        "review": response.review,
        "painpoints": response.painpoints,
        "areas_of_improvement": response.areas_of_improvement
    }


# API endpoint to generate charts based on input
@app.post("/generate-charts")
async def generate_charts(request: ChartRequest):
    # Filter the dataframe based on the input time range
    
    # Define your chart queries
    chart_queries = [
        "Which is the distribution of nationalities for the {request.time_range}?",
        "What is the average Score for each room type for the {request.time_range}?",
        "What is the distribution of the group types for the {request.time_range}?",
    ]
    
    # Generate the figures for each query
    charts = {}
    for i, query in enumerate(chart_queries):
        chart_key = f"chart_{i+1}"
        charts[chart_key] = generate_plot(df, query)
    
    return charts


# API endpoint to generate review analysis based on time range
@app.post("/review-analysis")
async def review_analysis_endpoint(request: ChartRequest):
    # Filter the dataframe based on the input time range
    filtered_df = filter_data_by_date(df, request.time_range)
    
    # Extract the positive and negative reviews from the filtered data
    positive_reviews = filtered_df['PositiveReview'].dropna().tolist()
    negative_reviews = filtered_df['NegativeReview'].dropna().tolist()
    
    # Combine positive and negative reviews
    reviews = positive_reviews + negative_reviews
    
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for the given time range.")
    
    # Analyze the reviews using the LLM
    analysis = analyze_reviews(reviews)
    
    return analysis

class RoomRequest(BaseModel):
    purpose: str
    guests: int
    duration: int

@app.post("/best-rooms")
async def best_rooms(request: RoomRequest):
    try:
        purpose = request.purpose
        guests = request.guests
        duration = request.duration
        
        list_of_rooms = ''
        with open('room_listing.txt', 'r') as file:
            list_of_rooms = file.read()
        

        class Rooms(BaseModel):
            best_room: str = Field(description="The best room for the given purpose, number of guests, and duration")
            why : str = Field(description="The reason why it is the best room for the given purpose, number of guests, and duration. Give it in points and in markdown format.")

        llm = ChatOpenAI(api_key=os.getenv('OPENAI_API_KEY'), model='gpt-4o-mini')
        llm_with_tool = llm.with_structured_output(Rooms)

        prompt = PromptTemplate(
            template=
        """
            Here are the list of rooms available in Lyf Funan Singapore: {list_of_rooms}
        Based on the customers coming in, recommend the best room for the given purpose, number of guests, and duration. Include the room type, and the reason why it is the best room for the given purpose, number of guests, and duration.
        Try to upsell the room if possible.
        Purpose: {purpose}
        Number of Guests: {guests}
        Duration: {duration} days
        Return:
        1. The best room for the given purpose, number of guests, and duration and an explanation of why it is the best room.
        2. Why it is the best room for the given purpose, number of guests, and duration. Give it in points and in markdown format.
        """,
            input_variables=["list_of_rooms", "purpose", "guests", "duration"]
        )
       

        chain = prompt | llm_with_tool
        results = chain.invoke({"list_of_rooms": list_of_rooms, "purpose": purpose, "guests": guests, "duration": duration})
        events = results.best_room
        why = results.why

        response_data = {"best_room": events, "why": why}

        return response_data

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
