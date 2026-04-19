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

    # ── Crowd Density (context-aware) ───────────────────────────────────────
    base_density = random.uniform(0.2, 0.7)

    if weather == "hot":
        base_density += 0.1

    if traffic == "high":
        base_density += 0.2

    density = round(min(base_density, 1.0), 2)

    if density < 0.3:
        density_level = "low"
    elif density < 0.7:
        density_level = "medium"
    else:
        density_level = "high"

    # ── Wait Time ──────────────────────────────────────────────────────────
    wait_time = int(density * 30)

    # ── Route ──────────────────────────────────────────────────────────────
    route = {
        "path": ["Gate A", "Corridor B", "Section C"],
        "estimated_time": 5 + int(density * 10),
        "is_accessible": True,
    }

    # ── Alerts ─────────────────────────────────────────────────────────────
    alerts = []
    if density > 0.75:
        alerts.append(
            {
                "type": "crowd",
                "severity": "high",
                "message": "High crowd density detected",
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

    # ── Predictive Intelligence ──────────────────────────────────────────
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
        "route": route,
        "alerts": alerts,
        "ai_insights": ai_insights,
        "prediction": prediction,
        "metadata": {
            "source": "enhanced-simulation",
            "weather": weather,
            "traffic": traffic,
        },
    }
