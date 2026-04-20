from fastapi import APIRouter, Depends
from typing import List
from app.models.event import Event
from app.core.database import db
from app.core.security import get_current_user

router = APIRouter(prefix="/events", tags=["user", "events"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[Event])
async def browse_events():
    return await db.events.find().to_list(100)
