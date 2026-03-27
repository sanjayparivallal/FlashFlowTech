import asyncio
import os
import sys
from datetime import datetime, timedelta, timezone

# Add backend directory to path so imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db.mongo import users_collection, trips_collection
from utils.auth import hash_password, generate_token

async def seed_db():
    print("Clearing collections...")
    await users_collection.delete_many({})
    await trips_collection.delete_many({})

    print("Seeding test user...")
    token = generate_token()
    user_doc = {
        "name": "Jane Eco",
        "email": "jane@example.com",
        "hashed_password": hash_password("password123"),
        "green_points": 18,  # (5 + 8 + 5)
        "token": token,
        "created_at": datetime.now(timezone.utc),
    }
    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    print(f"Created user: jane@example.com | password123")

    print("Seeding test trips (Lean schema)...")
    now = datetime.now(timezone.utc)
    trips = [
        {
            "user_id": user_id,
            "source": "Mumbai",
            "destination": "Pune",
            "distance_km": 150.0,
            "transport_mode": "electric_car",
            "created_at": now - timedelta(days=2),
        },
        {
            "user_id": user_id,
            "source": "Delhi",
            "destination": "Agra",
            "distance_km": 240.0,
            "transport_mode": "train",
            "created_at": now - timedelta(days=5),
        },
        {
            "user_id": user_id,
            "source": "Bangalore",
            "destination": "Mysore",
            "distance_km": 145.0,
            "transport_mode": "bus",
            "created_at": now - timedelta(days=10),
        }
    ]

    await trips_collection.insert_many(trips)
    print("Seeded 3 trips successfully.")
    print("Done!")

if __name__ == "__main__":
    asyncio.run(seed_db())
