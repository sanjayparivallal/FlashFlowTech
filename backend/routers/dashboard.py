from fastapi import APIRouter, Depends
from db.mongo import trips_collection
from utils.auth import get_current_user
from utils.transport import TRANSPORT_MODES

router = APIRouter()

@router.get("/stats")
async def dashboard_stats(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])

    # Fetch all user trips to compute stats in Python since metrics are not stored in DB
    cursor = trips_collection.find({"user_id": user_id})
    
    total_trips = 0
    total_co2_saved = 0.0
    total_cost = 0.0
    total_distance = 0.0
    total_points = 0
    
    mode_counts = {}
    monthly_data_map = {}

    async for trip in cursor:
        mode = trip["transport_mode"]
        dist = trip["distance_km"]
        created_at = trip["created_at"]
        
        data = TRANSPORT_MODES.get(mode)
        if not data:
            continue
            
        # Calculate missing fields on the fly
        co2_kg = dist * data["emission_per_km"]
        cost_inr = dist * data["cost_per_km"]
        points = data["eco_score"] // 10
        
        # Accumulate totals
        total_trips += 1
        total_distance += dist
        total_co2_saved += co2_kg
        total_cost += cost_inr
        total_points += points
        
        mode_counts[mode] = mode_counts.get(mode, 0) + 1
        
        # Month aggregation key (YYYY-MM)
        month_key = f"{created_at.year}-{created_at.month:02d}"
        if month_key not in monthly_data_map:
            monthly_data_map[month_key] = {"month": month_key, "co2_kg": 0.0, "trips": 0}
        
        monthly_data_map[month_key]["co2_kg"] += co2_kg
        monthly_data_map[month_key]["trips"] += 1

    # Format mode breakdown
    mode_breakdown = [{"mode": m, "count": c} for m, c in sorted(mode_counts.items(), key=lambda x: x[1], reverse=True)]
    
    # Format and sort monthly data
    monthly_co2 = []
    for k in sorted(monthly_data_map.keys()):
        item = monthly_data_map[k]
        item["co2_kg"] = round(item["co2_kg"], 2)
        monthly_co2.append(item)
    
    # Return formatted response
    return {
        "total_trips": total_trips,
        "total_co2_saved": round(total_co2_saved, 2),
        "total_cost": round(total_cost, 2),
        "total_distance": round(total_distance, 2),
        "total_points": total_points,
        "mode_breakdown": mode_breakdown,
        "monthly_co2": monthly_co2[-6:], # Last 6 months max
    }
