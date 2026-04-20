from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models import Venue
from app.core.database import db

router = APIRouter(prefix="/venues", tags=["venues"])

@router.post("/", response_model=Venue, status_code=status.HTTP_201_CREATED)
async def create_venue(venue: Venue):
    """Insert a new venue into MongoDB Atlas"""
    venue_dict = venue.model_dump(by_alias=True, exclude={"id"})
    
    # Insert into database
    result = await db.venues.insert_one(venue_dict)
    
    # Fetch the inserted document
    created_venue = await db.venues.find_one({"_id": result.inserted_id})
    if created_venue:
        return created_venue
    
    raise HTTPException(status_code=500, detail="Failed to create venue")

@router.get("/", response_model=List[Venue])
async def get_venues():
    """Return all venues"""
    venues = await db.venues.find().to_list(1000)
    return venues
