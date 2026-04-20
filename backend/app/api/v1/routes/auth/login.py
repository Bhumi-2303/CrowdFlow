from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import db
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/login", tags=["auth"])

@router.post("/")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = await db.users.find_one({"email": form_data.username})
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(form_data.password, user_dict["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=str(user_dict["_id"]), role=user_dict.get("role", "user"))
    return {"access_token": access_token, "token_type": "bearer"}
