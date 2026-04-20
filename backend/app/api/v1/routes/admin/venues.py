from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from app.models.venue import Venue
from app.models.zone import Zone
from app.core.database import db
from app.core.security import require_admin, TokenData

router = APIRouter(prefix="/venues", tags=["admin", "venues"], dependencies=[Depends(require_admin)])

@router.post("/", response_model=Venue, status_code=status.HTTP_201_CREATED)
async def create_venue(venue: Venue):
    venue_dict = venue.model_dump(by_alias=True, exclude={"id"})
    result = await db.venues.insert_one(venue_dict)
    created_venue = await db.venues.find_one({"_id": result.inserted_id})
    return created_venue

@router.get("/", response_model=List[Venue])
async def list_venues():
    return await db.venues.find().to_list(1000)

@router.delete("/{venue_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_venue(venue_id: str):
    result = await db.venues.delete_one({"_id": ObjectId(venue_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Venue not found")
    return None

@router.post("/{venue_id}/zones", response_model=Zone, status_code=status.HTTP_201_CREATED)
async def create_zone(venue_id: str, zone: Zone):
    zone_dict = zone.model_dump(by_alias=True, exclude={"id"})
    zone_dict["venue_id"] = venue_id
    result = await db.zones.insert_one(zone_dict)
    created_zone = await db.zones.find_one({"_id": result.inserted_id})
    return created_zone

@router.get("/{venue_id}/zones", response_model=List[Zone])
async def list_zones(venue_id: str):
    return await db.zones.find({"venue_id": venue_id}).to_list(1000)
