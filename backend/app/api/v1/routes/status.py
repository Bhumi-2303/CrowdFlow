from fastapi import APIRouter
import random
import time

from app.services.weather_service import get_weather_condition
from app.services.traffic_service import get_traffic_level
from app.services.ai_adapter import generate_ai_insights

router = APIRouter()


@router.get("/status", tags=["Status"])
def get_status(lat: float, lng: float) -> dict:
    """
    Return a simulated real-time status for the given venue coordinates.

    Crowd density is computed from a base random sample that is pushed
    upward when weather is hot (+0.1) or traffic is high (+0.2).
    AI insights are generated via Google Gemini (falls back gracefully
    when the API key is absent).

    Args:
        lat: Latitude of the venue/zone.
        lng: Longitude of the venue/zone.

    Returns:
        Crowd density, estimated wait time, recommended route, active alerts,
        AI-generated insights, and contextual metadata.
    """
    current_time = int(time.time())

    # ── External signals ────────────────────────────────────────────────────
    weather = get_weather_condition(lat, lng)
    traffic = get_traffic_level(lat, lng)

    # ── Zone Intelligence (Multi-zone Support) ──────────────────────────────
    zone_names = ["Gate A", "Gate B", "Food Court", "Parking", "Exit Gate"]
    zones = []
    
    for name in zone_names:
        # Independent density for each zone
        z_base = random.uniform(0.15, 0.75)
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
                "lat": lat + random.uniform(-0.001, 0.001),
                "lng": lng + random.uniform(-0.001, 0.001),
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
        "path": ["Gate A", "Corridor B", "Section C"],
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
                "message": "High crowd density detected in specific zones",
            }
        )

    # ── AI Insights ────────────────────────────────────────────────────────
    ai_context = {
        "density": density,
        "density_level": density_level,
        "weather": weather,
        "traffic": traffic,
        "wait_time": wait_time,
    }
    ai_insights = generate_ai_insights(ai_context)

    # ── Predictive Intelligence (Overall) ──────────────────────────────────
    # Existing overall prediction logic maintained for backward compatibility
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
            "lat": lat,
            "lng": lng,
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
            "weather": weather,
            "traffic": traffic,
        },
    }
