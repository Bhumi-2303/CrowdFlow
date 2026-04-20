from typing import Optional
from pydantic import Field
from .base import TimestampedModel, PyObjectId

class Zone(TimestampedModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(..., min_length=2, max_length=100)
    venue_id: PyObjectId = Field(...)
    capacity: int = Field(..., gt=0)
