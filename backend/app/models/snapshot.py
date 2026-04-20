from typing import Optional
from pydantic import Field
from .base import TimestampedModel, PyObjectId

class CrowdSnapshot(TimestampedModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    zone_id: PyObjectId = Field(...)
    event_id: Optional[PyObjectId] = None
    density_level: str = Field(..., pattern="^(low|medium|high|critical)$")
    density_value: float = Field(..., ge=0.0, le=1.0)
    wait_time_minutes: int = Field(default=0, ge=0)
