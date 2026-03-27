from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from db.mongo import trips_collection, users_collection
from models.trip import TripCompareRequest, TripSelectRequest
from utils.transport import calculate_results, TRANSPORT_MODES
from utils.auth import get_current_user

router = APIRouter()


@router.post("/compare")
async def compare_trips(body: TripCompareRequest, current_user: dict = Depends(get_current_user)):
    results = calculate_results(body.distance_km)
    return {
        "source": body.source,
        "destination": body.destination,
        "distance_km": body.distance_km,
        "options": results,
    }


@router.post("/select")
async def select_trip(body: TripSelectRequest, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])

    # Calculate points for updating the user, but we won't store it in the trip document
    mode_data = TRANSPORT_MODES.get(body.transport_mode)
    if not mode_data:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"Unknown transport mode: {body.transport_mode}")

    eco_score = mode_data["eco_score"]
    points_earned = eco_score // 10

    trip_doc = {
        "user_id": user_id,
        "source": body.source,
        "destination": body.destination,
        "transport_mode": body.transport_mode,
        "distance_km": body.distance_km,
        "created_at": datetime.now(timezone.utc),
    }

    await trips_collection.insert_one(trip_doc)

    # Update user's green_points
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$inc": {"green_points": points_earned}},
    )

    # Fetch updated green_points
    updated_user = await users_collection.find_one({"_id": current_user["_id"]})
    total_points = updated_user.get("green_points", 0) if updated_user else 0

    return {
        "points_earned": points_earned,
        "total_green_points": total_points,
        "message": f"Trip saved! You earned {points_earned} green points.",
    }


@router.get("/history")
async def trip_history(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    cursor = trips_collection.find(
        {"user_id": user_id}, {"_id": 0}
    ).sort("created_at", -1)

    trips = []
    async for trip in cursor:
        mode = trip["transport_mode"]
        dist = trip["distance_km"]
        data = TRANSPORT_MODES.get(mode)
        
        # Calculate on the fly (never stored in DB)
        if data:
            time_m = round((dist / data["speed_kmh"]) * 60, 1)
            trip["time_min"] = time_m
            trip["cost_inr"] = round(dist * data["cost_per_km"], 2)
            trip["co2_kg"] = round(dist * data["emission_per_km"], 3)
            trip["calories"] = round((time_m / 60) * data.get("calories_per_h", 0))
            trip["comfort"] = data.get("comfort_rating", 0)
            trip["eco_score"] = data["eco_score"]
            trip["points_earned"] = data["eco_score"] // 10
        else:
            trip["time_min"] = trip["cost_inr"] = trip["co2_kg"] = trip["calories"] = trip["comfort"] = trip["eco_score"] = trip["points_earned"] = 0
            
        trip["created_at"] = trip["created_at"].isoformat()
        trips.append(trip)

    return {"trips": trips}
