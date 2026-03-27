TRANSPORT_MODES = {
    "walk": {
        "icon": "🚶",
        "speed_kmh": 5,
        "cost_per_km": 0.0,
        "emission_per_km": 0.000,
        "eco_score": 100,
    },
    "cycle": {
        "icon": "🚲",
        "speed_kmh": 15,
        "cost_per_km": 0.0,
        "emission_per_km": 0.000,
        "eco_score": 98,
    },
    "ev_bike": {
        "icon": "⚡🏍️",
        "speed_kmh": 45,
        "cost_per_km": 0.5,
        "emission_per_km": 0.010,
        "eco_score": 92,
    },
    "train": {
        "icon": "🚆",
        "speed_kmh": 80,
        "cost_per_km": 0.8,
        "emission_per_km": 0.014,
        "eco_score": 94,
    },
    "bus": {
        "icon": "🚌",
        "speed_kmh": 30,
        "cost_per_km": 1.0,
        "emission_per_km": 0.040,
        "eco_score": 85,
    },
    "ev_car": {
        "icon": "🔋🚗",
        "speed_kmh": 55,
        "cost_per_km": 2.0,
        "emission_per_km": 0.050,
        "eco_score": 80,
    },
    "bike": {
        "icon": "🏍️",
        "speed_kmh": 40,
        "cost_per_km": 2.5,
        "emission_per_km": 0.065,
        "eco_score": 60,
    },
    "car": {
        "icon": "🚗",
        "speed_kmh": 50,
        "cost_per_km": 6.5,
        "emission_per_km": 0.210,
        "eco_score": 25,
    },
}


def calculate_results(distance_km: float) -> list:
    results = []
    
    # Pre-calculate raw stats
    for mode, data in TRANSPORT_MODES.items():
        time_min = round((distance_km / data["speed_kmh"]) * 60, 1)
        cost_inr = round(distance_km * data["cost_per_km"], 2)
        co2_kg = round(distance_km * data["emission_per_km"], 3)
        
        # Dynamic scoring logic: 
        # Base score is the mode's static eco_score
        dynamic_score = float(data["eco_score"])
        
        # Punish slow modes (walk/cycle) heavily for long distances (>5km)
        if time_min > 60:
            # subtract points for every minute over an hour
            dynamic_score -= (time_min - 60) * 0.5 
            
        # Hard cap for walk/cycle if it takes more than 2 hours
        if time_min > 120 and mode in ["walk", "cycle"]:
            dynamic_score -= 50
            
        dynamic_score = max(0, min(100, int(dynamic_score)))

        results.append(
            {
                "transport_mode": mode,
                "icon": data["icon"],
                "distance_km": round(distance_km, 2),
                "time_min": time_min,
                "cost_inr": cost_inr,
                "co2_kg": co2_kg,
                "eco_score": dynamic_score,
                "is_best_time": False,
                "is_best_cost": False,
                "is_best_co2": False,
                "is_best_choice": False
            }
        )

    # Find the minimums to highlight them
    min_time = min(r["time_min"] for r in results)
    min_cost = min(r["cost_inr"] for r in results)
    min_co2 = min(r["co2_kg"] for r in results)
    
    # Mark the highlights
    for r in results:
        if r["time_min"] == min_time:
            r["is_best_time"] = True
        if r["cost_inr"] == min_cost:
            r["is_best_cost"] = True
        if r["co2_kg"] == min_co2:
            r["is_best_co2"] = True

    # Sort by dynamic eco_score descending
    results.sort(key=lambda x: x["eco_score"], reverse=True)
    
    # Mark the absolute best overall
    if results:
        results[0]["is_best_choice"] = True
        
    return results

