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
        
        results.append(
            {
                "transport_mode": mode,
                "icon": data["icon"],
                "distance_km": round(distance_km, 2),
                "time_min": time_min,
                "cost_inr": cost_inr,
                "co2_kg": co2_kg,
                # Start with a base score scaled down heavily (max ~40 points for being perfectly green)
                "eco_score": float(data["eco_score"]) * 0.4,
                "is_best_time": False,
                "is_best_cost": False,
                "is_best_co2": False,
                "is_best_choice": False
            }
        )

    # Find the minimums to determine who wins the bonus points
    min_time = min(r["time_min"] for r in results)
    min_cost = min(r["cost_inr"] for r in results)
    min_co2 = min(r["co2_kg"] for r in results)
    
    # Award competitive points!
    for r in results:
        # Time bonus (20 max points relative to how close to the fastest they are)
        if r["time_min"] == min_time:
            r["is_best_time"] = True
            r["eco_score"] += 20
        elif r["time_min"] <= min_time * 1.5: # Close second gets some points
            r["eco_score"] += 10
            
        # Cost bonus (20 max points)
        if r["cost_inr"] == min_cost:
            r["is_best_cost"] = True
            r["eco_score"] += 20
        elif r["cost_inr"] <= min_cost + 10: # Almost free gets points
            r["eco_score"] += 10
            
        # Carbon bonus (20 max points)
        if r["co2_kg"] == min_co2:
            r["is_best_co2"] = True
            r["eco_score"] += 20
            
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

