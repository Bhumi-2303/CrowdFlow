from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from app.models.event import Event
from app.core.database import db
from app.core.security import require_admin

router = APIRouter(prefix="/events", tags=["admin", "events"], dependencies=[Depends(require_admin)])

@router.post("/", response_model=Event, status_code=status.HTTP_201_CREATED)
async def create_event(event: Event):
    event_dict = event.model_dump(by_alias=True, exclude={"id"})
    result = await db.events.insert_one(event_dict)
    created_event = await db.events.find_one({"_id": result.inserted_id})
    return created_event

@router.get("/", response_model=List[Event])
async def list_events():
    return await db.events.find().to_list(1000)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: str):
    result = await db.events.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return None
