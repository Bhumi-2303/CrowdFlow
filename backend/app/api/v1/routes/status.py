from fastapi import APIRouter, Query
from typing import Optional
import random
import time

from app.services.weather_service import get_weather_condition
from app.services.traffic_service import get_traffic_level
from app.services.ai_adapter import generate_ai_insights

router = APIRouter()

@router.get("/status", tags=["Status"])
def get_status(
    user_id: Optional[str] = Query(None, description="User ID"),
    event: Optional[str] = Query(None, description="Event type: concert, match, expo"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lng: Optional[float] = Query(None, description="Longitude")
) -> dict:
    """
    Return a simulated real-time status for the given venue/event.
    """
    current_time = int(time.time())

    if user_id == "user123":
        event = "concert"
    elif user_id == "user456":
        event = "match"
    elif not event:
        event = "concert"

    # ── Event-specific logic ────────────────────────────────────────────────
    if event == "concert":
        evt_lat = 23.0225
        evt_lng = 72.5714
        zone_names = ["Main Entrance", "VIP Gate", "Food Court", "Merch Stand", "General Admission"]
        density_boost = 0.2
    elif event == "match":
        evt_lat = 19.0760
        evt_lng = 72.8777
        zone_names = ["North Stand", "South Stand", "East Stand", "West Stand", "Parking Area"]
        density_boost = 0.3
    elif event == "expo":
        evt_lat = 28.6139
        evt_lng = 77.2090
        zone_names = ["Hall A", "Hall B", "Registration", "Networking Lounge", "Exit"]
        density_boost = 0.0
    else:
        evt_lat = 23.0225
        evt_lng = 72.5714
        zone_names = ["Gate A", "Gate B", "Food Court", "Parking", "Exit Gate"]
        density_boost = 0.1

    # Override with provided lat/lng if available
    final_lat = lat if lat is not None else evt_lat
    final_lng = lng if lng is not None else evt_lng

    # ── External signals ────────────────────────────────────────────────────
    weather = get_weather_condition(final_lat, final_lng)
    traffic = get_traffic_level(final_lat, final_lng)

    # ── Zone Intelligence (Multi-zone Support) ──────────────────────────────
    zones = []
    
    for name in zone_names:
        # Independent density for each zone
        z_base = random.uniform(0.15, 0.65) + density_boost
        if weather == "hot": z_base += 0.05
        if traffic == "high": z_base += 0.1
        z_density = round(min(z_base, 1.0), 2)
        
        z_level = "low" if z_density < 0.3 else "medium" if z_density < 0.7 else "high"
        z_wait = int(z_density * 45)
        
        # Zone-specific prediction
        z_pred_val = round(min(max(z_density + random.uniform(-0.05, 0.15), 0.0), 1.0), 2)
        z_pred_level = "low" if z_pred_val < 0.4 else "medium" if z_pred_val <= 0.7 else "high"
        
        z_rec = "Safe to proceed."
        if z_pred_level == "high":
            z_rec = "Avoid this route. Use alternate path."
        elif z_pred_level == "medium":
            z_rec = "Crowd increasing. Plan accordingly."
            
        zones.append({
            "name": name,
            "location": {
                "lat": final_lat + random.uniform(-0.002, 0.002),
                "lng": final_lng + random.uniform(-0.002, 0.002),
            },
            "crowd_density": {
                "value": z_density,
                "level": z_level,
            },
            "waiting_time": {
                "minutes": z_wait,
            },
            "prediction": {
                "value": z_pred_val,
                "level": z_pred_level,
                "recommendation": z_rec,
            }
        })

    # Calculate overall averages for top-level fields
    avg_density = round(sum(z["crowd_density"]["value"] for z in zones) / len(zones), 2)
    avg_wait = int(sum(z["waiting_time"]["minutes"] for z in zones) / len(zones))
    
    density = avg_density
    density_level = "low" if density < 0.3 else "medium" if density < 0.7 else "high"
    wait_time = avg_wait

    # ── Route ──────────────────────────────────────────────────────────────
    route = {
        "path": [zone_names[0], zone_names[2], zone_names[-1]],
        "estimated_time": 5 + int(density * 10),
        "is_accessible": True,
    }

    # ── Alerts ─────────────────────────────────────────────────────────────
    alerts = []
    if any(z["crowd_density"]["value"] > 0.8 for z in zones):
        alerts.append(
            {
                "type": "crowd",
                "severity": "high",
                "message": f"High crowd density detected at the {event.title() if event else 'venue'}",
            }
        )

    # ── AI Insights ────────────────────────────────────────────────────────
    ai_context = {
        "event_type": event,
        "density": density,
        "density_level": density_level,
        "weather": weather,
        "traffic": traffic,
        "wait_time": wait_time,
    }
    ai_insights = generate_ai_insights(ai_context)

    # ── Predictive Intelligence (Overall) ──────────────────────────────────
    predicted_density = density
    if weather == "hot":
        predicted_density += 0.1
    if traffic == "high":
        predicted_density += 0.15
    
    predicted_density += random.uniform(-0.05, 0.05)
    predicted_density = round(min(max(predicted_density, 0.0), 1.0), 2)

    if predicted_density < 0.4:
        prediction_level = "low"
        recommendation = "Safe to proceed."
    elif predicted_density <= 0.7:
        prediction_level = "medium"
        recommendation = "Crowd increasing. Plan accordingly."
    else:
        prediction_level = "high"
        recommendation = "Avoid this route. Use alternate path."

    prediction = {
        "value": predicted_density,
        "level": prediction_level,
        "recommendation": recommendation,
        "time_horizon": "10 min"
    }

    return {
        "timestamp": current_time,
        "location": {
            "lat": final_lat,
            "lng": final_lng,
        },
        "crowd_density": {
            "value": density,
            "level": density_level,
        },
        "waiting_time": {
            "minutes": wait_time,
        },
        "zones": zones,
        "route": route,
        "alerts": alerts,
        "ai_insights": ai_insights,
        "prediction": prediction,
        "metadata": {
            "source": "multi-zone-intelligence",
            "event": event,
            "weather": weather,
            "traffic": traffic,
        },
    }
