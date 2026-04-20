from typing import Optional
from datetime import datetime
from pydantic import Field
from .base import TimestampedModel, PyObjectId

class Event(TimestampedModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(..., min_length=2, max_length=150)
    venue_id: PyObjectId = Field(...)
    start_time: datetime
    end_time: datetime
    expected_attendance: Optional[int] = Field(default=None, ge=0)
