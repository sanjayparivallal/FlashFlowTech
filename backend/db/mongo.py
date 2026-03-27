from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "flashflowtech")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

users_collection = db["users"]
trips_collection = db["trips"]
