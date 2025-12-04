from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid

router = APIRouter()

from app.database import models
from app.dependencies import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

class LoginRequest(BaseModel):
    email: str
    name: str
    google_id: str

@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    if not user:
        # Create new user
        user = models.User(
            id=request.google_id, # Use Google ID as User ID for simplicity, or generate UUID
            email=request.email,
            name=request.name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Generate a simple token (in real app, use JWT)
    token = f"demo-token-{user.email}"
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "personality_config": user.personality_config
        }
    }

@router.get("/me")
async def get_current_user_info():
    # Placeholder for getting user info
    return {
        "id": "user_123",
        "username": "Demo User",
        "plan": "pro"
    }
