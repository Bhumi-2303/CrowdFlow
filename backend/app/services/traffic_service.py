import random


def get_traffic_level(lat: float, lng: float) -> str:
    """
    Return a simulated traffic congestion level for the given coordinates.

    A congestion ratio is randomly sampled in [0.8, 2.0] and mapped to
    one of three descriptive levels used by downstream services.

    Args:
        lat: Latitude of the venue/zone.
        lng: Longitude of the venue/zone.

    Returns:
        "low"    — ratio < 1.2  (free-flowing)
        "medium" — ratio < 1.5  (moderate congestion)
        "high"   — ratio >= 1.5 (heavy congestion)
    """
    ratio = random.uniform(0.8, 2.0)

    if ratio < 1.2:
        return "low"
    elif ratio < 1.5:
        return "medium"
    else:
        return "high"
