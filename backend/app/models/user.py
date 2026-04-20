from typing import Optional
from pydantic import Field
from .base import TimestampedModel, PyObjectId

class User(TimestampedModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    hashed_password: str = Field(...)
    role: str = Field(default="user", pattern="^(admin|user|staff)$")
