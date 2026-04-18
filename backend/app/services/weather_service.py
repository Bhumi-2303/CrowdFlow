import random


def get_weather_condition(lat: float, lng: float) -> str:
    """
    Return a simulated weather condition for the given coordinates.

    Temperature is randomly sampled in the range [20, 40]°C and mapped
    to one of three descriptive levels used by downstream services.

    Args:
        lat: Latitude of the venue/zone.
        lng: Longitude of the venue/zone.

    Returns:
        "hot"    — temperature > 35 °C
        "cool"   — temperature < 25 °C
        "normal" — everything in between
    """
    temp = random.randint(20, 40)

    if temp > 35:
        return "hot"
    elif temp < 25:
        return "cool"
    else:
        return "normal"
