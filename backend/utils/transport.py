TRANSPORT_MODES = {
    "walk": {
        "icon": "🚶",
        "speed_kmh": 5,
        "cost_per_km": 0.0,
        "emission_per_km": 0.000,
        "eco_score": 100,
        "calories_per_h": 300,
        "comfort_rating": 2, # Out of 10
    },
    "cycle": {
        "icon": "🚲",
        "speed_kmh": 15,
        "cost_per_km": 0.0,
        "emission_per_km": 0.000,
        "eco_score": 98,
        "calories_per_h": 450,
        "comfort_rating": 3,
    },
    "ev_bike": {
        "icon": "⚡🏍️",
        "speed_kmh": 45,
        "cost_per_km": 0.5,
        "emission_per_km": 0.010,
        "eco_score": 92,
        "calories_per_h": 100,
        "comfort_rating": 5,
    },
    "train": {
        "icon": "🚆",
        "speed_kmh": 80,
        "cost_per_km": 0.8,
        "emission_per_km": 0.014,
        "eco_score": 94,
        "calories_per_h": 50,
        "comfort_rating": 7,
    },
    "bus": {
        "icon": "🚌",
        "speed_kmh": 30,
        "cost_per_km": 1.0,
        "emission_per_km": 0.040,
        "eco_score": 85,
        "calories_per_h": 50,
        "comfort_rating": 6,
    },
    "ev_car": {
        "icon": "🔋🚗",
        "speed_kmh": 55,
        "cost_per_km": 2.0,
        "emission_per_km": 0.050,
        "eco_score": 80,
        "calories_per_h": 50,
        "comfort_rating": 9,
    },
    "bike": {
        "icon": "🏍️",
        "speed_kmh": 40,
        "cost_per_km": 2.5,
        "emission_per_km": 0.065,
        "eco_score": 60,
        "calories_per_h": 100,
        "comfort_rating": 5,
    },
    "car": {
        "icon": "🚗",
        "speed_kmh": 50,
        "cost_per_km": 6.5,
        "emission_per_km": 0.210,
        "eco_score": 25,
        "calories_per_h": 50,
        "comfort_rating": 10,
    },
}


def calculate_results(distance_km: float) -> list:
    results = []
    
    # Pre-calculate raw stats
    for mode, data in TRANSPORT_MODES.items():
        time_min = round((distance_km / data["speed_kmh"]) * 60, 1)
        cost_inr = round(distance_km * data["cost_per_km"], 2)
        co2_kg = round(distance_km * data["emission_per_km"], 3)
        
        # Calculate calories based on time spent
        calories_burned = round((time_min / 60) * data["calories_per_h"])
        comfort_rating = data["comfort_rating"]
        
        results.append(
            {
                "transport_mode": mode,
                "icon": data["icon"],
                "distance_km": round(distance_km, 2),
                "time_min": time_min,
                "cost_inr": cost_inr,
                "co2_kg": co2_kg,
                "calories": calories_burned,
                "comfort": comfort_rating,
                # Start with a base score scaled down heavily (max ~30 points for being perfectly green)
                "eco_score": float(data["eco_score"]) * 0.3,
                "is_best_time": False,
                "is_best_cost": False,
                "is_best_co2": False,
                "is_best_health": False,
                "is_best_comfort": False,
                "is_best_choice": False
            }
        )

    # Find the minimums and maximums to determine who wins the bonus points
    min_time = min(r["time_min"] for r in results)
    min_cost = min(r["cost_inr"] for r in results)
    min_co2 = min(r["co2_kg"] for r in results)
    max_calories = max(r["calories"] for r in results)
    max_comfort = max(r["comfort"] for r in results)
    
    # Award competitive points!
    for r in results:
        # Time bonus (15 max points)
        if r["time_min"] == min_time:
            r["is_best_time"] = True
            r["eco_score"] += 15
        elif r["time_min"] <= float(min_time) * 1.5:
            r["eco_score"] += 8
            
        # Cost bonus (15 max points)
        if r["cost_inr"] == min_cost:
            r["is_best_cost"] = True
            r["eco_score"] += 15
        elif r["cost_inr"] <= float(min_cost) + 10:
            r["eco_score"] += 8
            
        # Carbon bonus (15 max points)
        if r["co2_kg"] == min_co2:
            r["is_best_co2"] = True
            r["eco_score"] += 15
            
        # Health (Calories) bonus (15 max points)
        if r["calories"] == max_calories and r["calories"] > 50:
            r["is_best_health"] = True
            r["eco_score"] += 15
            
        # Comfort bonus (10 max points)
        if r["comfort"] == max_comfort:
            r["is_best_comfort"] = True
            r["eco_score"] += 10
            
        # Distance-specific realistic penalties
        if r["time_min"] > 180 and r["transport_mode"] in ["walk", "cycle"]:
            # Literally impossible to walk 100km effectively for daily transit
            r["eco_score"] -= 50
            
        # Normalize score to 1-100 gauge
        r["eco_score"] = max(1, min(100, int(r["eco_score"])))

    # Sort by dynamic eco_score descending to find the absolute winner
    results.sort(key=lambda x: x["eco_score"], reverse=True)
    
    # Mark the absolute best overall
    if results:
        results[0]["is_best_choice"] = True
        
    return results

