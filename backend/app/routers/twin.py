from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.dependencies import get_db, get_current_user
from app.database import models

router = APIRouter()

class TwinProfileUpdate(BaseModel):
    energy: int
    formality: int

@router.get("/profile")
async def get_twin_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "energy": user.personality_config.get("energy", 50),
        "formality": user.personality_config.get("formality", 50)
    }

@router.put("/profile")
async def update_twin_profile(
    profile: TwinProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.personality_config = {
        "energy": profile.energy,
        "formality": profile.formality
    }
    db.commit()
    return {"status": "success", "profile": user.personality_config}
