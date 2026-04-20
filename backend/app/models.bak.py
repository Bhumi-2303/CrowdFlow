from pydantic import BaseModel, Field, BeforeValidator
from typing import Annotated, Optional

# Converts ObjectId to string automatically if needed
# This ensures ObjectId is converted to string in responses
PyObjectId = Annotated[str, BeforeValidator(str)]

class Venue(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    latitude: float
    longitude: float
    capacity: int

    model_config = {
        "populate_by_name": True,
    }

class Zone(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    venue_id: str
    capacity: int

    model_config = {
        "populate_by_name": True,
    }
