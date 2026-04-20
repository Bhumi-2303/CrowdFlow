from pydantic import BaseModel, Field, BeforeValidator, ConfigDict
from typing import Annotated
from datetime import datetime, timezone

# Converts ObjectId to string automatically if needed
PyObjectId = Annotated[str, BeforeValidator(str)]

class TimestampedModel(BaseModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
