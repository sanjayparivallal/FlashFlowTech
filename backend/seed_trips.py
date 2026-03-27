"""
Seed script: inserts realistic trips for sanjay (69c65042ab1d14d3a4029433)
across the last 6 months with varied transport modes and distances.
Run: python seed_trips.py
"""
import asyncio
from datetime import datetime, timezone, timedelta
import random
from db.mongo import trips_collection, users_collection
from bson import ObjectId
from utils.transport import TRANSPORT_MODES

USER_ID = "69c65042ab1d14d3a4029433"

ROUTES = [
    ("Anna Nagar", "T. Nagar", 8.5),
    ("Velachery", "Guindy", 6.2),
    ("Adyar", "Egmore", 12.0),
    ("Porur", "Tambaram", 18.5),
    ("Maduravoyal", "Chennai Central", 22.0),
    ("Sholinganallur", "OMR", 5.0),
    ("Perungudi", "Saidapet", 9.3),
    ("Nungambakkam", "Kodambakkam", 4.5),
    ("Mylapore", "Besant Nagar", 3.8),
    ("Avadi", "Ambattur", 11.0),
    ("Thiruvanmiyur", "Chrompet", 14.2),
    ("Kolathur", "Villivakkam", 7.6),
]

# Weighted pool: eco-friendly modes appear more (reflects sanjay's green behaviour)
MODE_POOL = (
    ["walk"] * 4
    + ["cycle"] * 5
    + ["ev_bike"] * 7
    + ["train"] * 8
    + ["bus"] * 9
    + ["ev_car"] * 7
    + ["bike"] * 6
    + ["car"] * 4
)

async def seed():
    now = datetime.now(timezone.utc)

    # Build 60 trips spread over the last 6 months
    trips = []
    for month_offset in range(6):           # months 0-5 ago
        base = now.replace(day=1) - timedelta(days=30 * month_offset)
        # 8-12 trips per month
        count = random.randint(8, 12)
        for _ in range(count):
            day = random.randint(1, 28)
            hour = random.randint(7, 21)
            ts = base.replace(day=day, hour=hour, minute=random.randint(0, 59), second=0, microsecond=0)
            route = random.choice(ROUTES)
            mode = random.choice(MODE_POOL)
            trips.append({
                "user_id": USER_ID,
                "source": route[0],
                "destination": route[1],
                "distance_km": route[2],
                "transport_mode": mode,
                "created_at": ts,
            })

    # Calculate total points to add to user
    total_points = sum(
        (TRANSPORT_MODES[t["transport_mode"]]["eco_score"] // 10)
        for t in trips
    )

    result = await trips_collection.insert_many(trips)
    print(f"✅ Inserted {len(result.inserted_ids)} trips")

    # Update green_points on the user
    await users_collection.update_one(
        {"_id": ObjectId(USER_ID)},
        {"$inc": {"green_points": total_points}},
    )
    print(f"✅ Added {total_points} green points to sanjay")

if __name__ == "__main__":
    asyncio.run(seed())
