import os
import json
import logging

import requests

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ---------------------------------------------------------------------------
# Fallback response (used when Gemini is unavailable or key is missing)
# ---------------------------------------------------------------------------

def _build_fallback(context: dict) -> dict:
    risk = "medium" if context["density"] > 0.5 else "low"
    return {
        "risk_level": risk,
        "recommendations": [
            "Consider alternative routes",
            "Monitor crowd density",
        ],
        "alert_message": "Fallback AI active",
    }


# ---------------------------------------------------------------------------
# Public interface
# ---------------------------------------------------------------------------

def generate_ai_insights(context: dict) -> dict:
    """
    Call Google Gemini to produce structured crowd-intelligence insights.

    Args:
        context: Dictionary containing:
            - density       (float)
            - density_level (str)
            - weather       (str)
            - traffic       (str)
            - wait_time     (int)

    Returns:
        dict with keys: risk_level (str), recommendations (list[str]),
        alert_message (str).  Falls back gracefully on any failure.
    """
    fallback = _build_fallback(context)

    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set — using fallback AI response.")
        return fallback

    prompt = f"""
Analyze crowd conditions and return JSON only:

{{
  "risk_level": "low|medium|high",
  "recommendations": ["string"],
  "alert_message": "string"
}}

Data:
Density: {context['density']}
Level: {context['density_level']}
Weather: {context['weather']}
Traffic: {context['traffic']}
Wait Time: {context['wait_time']}
"""

    try:
        url = (
            "https://generativelanguage.googleapis.com/v1beta"
            f"/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        )

        response = requests.post(
            url,
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=10,
        )
        response.raise_for_status()

        data = response.json()
        text_output = data["candidates"][0]["content"]["parts"][0]["text"]

        # Strip possible markdown fences Gemini sometimes adds
        text_output = text_output.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()

        return json.loads(text_output)

    except json.JSONDecodeError:
        logger.warning("Gemini returned non-JSON text — using fallback.")
        return fallback
    except Exception as exc:  # network errors, key errors, HTTP errors
        logger.warning("Gemini call failed (%s) — using fallback.", exc)
        return fallback
