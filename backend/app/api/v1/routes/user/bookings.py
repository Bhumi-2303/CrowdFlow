from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from app.models.booking import Booking
from app.core.database import db
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/bookings", tags=["user", "bookings"])

@router.post("/", response_model=Booking, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: Booking, current_user: TokenData = Depends(get_current_user)):
    booking_dict = booking.model_dump(by_alias=True, exclude={"id"})
    booking_dict["user_id"] = current_user.user_id
    result = await db.bookings.insert_one(booking_dict)
    created_booking = await db.bookings.find_one({"_id": result.inserted_id})
    return created_booking

@router.get("/", response_model=List[Booking])
async def get_my_bookings(current_user: TokenData = Depends(get_current_user)):
    return await db.bookings.find({"user_id": current_user.user_id}).to_list(100)

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking(booking_id: str, current_user: TokenData = Depends(get_current_user)):
    result = await db.bookings.update_one(
        {"_id": ObjectId(booking_id), "user_id": current_user.user_id},
        {"$set": {"status": "cancelled"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found or already cancelled")
    return None
