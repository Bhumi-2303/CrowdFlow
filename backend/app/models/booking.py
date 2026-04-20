from typing import Optional
from pydantic import Field
from .base import TimestampedModel, PyObjectId

class Booking(TimestampedModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId = Field(...)
    event_id: PyObjectId = Field(...)
    zone_id: Optional[PyObjectId] = None
    ticket_count: int = Field(default=1, gt=0)
    status: str = Field(default="confirmed", pattern="^(confirmed|cancelled|pending)$")
