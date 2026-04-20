from fastapi import APIRouter, HTTPException, status
from app.models.user import User
from app.core.database import db
from app.core.security import get_password_hash, create_access_token

router = APIRouter(prefix="/register", tags=["auth"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def register(user: User):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    user_dict = user.model_dump(by_alias=True, exclude={"id"})
    user_dict["hashed_password"] = get_password_hash(user.hashed_password)
    
    # Create user
    result = await db.users.insert_one(user_dict)
    
    # Return token
    access_token = create_access_token(subject=str(result.inserted_id), role=user.role)
    return {"access_token": access_token, "token_type": "bearer"}
