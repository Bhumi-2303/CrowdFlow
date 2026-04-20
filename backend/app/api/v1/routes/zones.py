from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models import Zone
from app.core.database import db

router = APIRouter(prefix="/zones", tags=["zones"])

@router.post("/", response_model=Zone, status_code=status.HTTP_201_CREATED)
async def create_zone(zone: Zone):
    """Insert a new zone into MongoDB Atlas"""
    zone_dict = zone.model_dump(by_alias=True, exclude={"id"})
    
    # Insert into database
    result = await db.zones.insert_one(zone_dict)
    
    # Fetch the inserted document
    created_zone = await db.zones.find_one({"_id": result.inserted_id})
    if created_zone:
        return created_zone
        
    raise HTTPException(status_code=500, detail="Failed to create zone")

@router.get("/", response_model=List[Zone])
async def get_zones():
    """Return all zones"""
    zones = await db.zones.find().to_list(1000)
    return zones
