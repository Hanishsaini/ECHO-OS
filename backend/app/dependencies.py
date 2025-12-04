from fastapi import Header, HTTPException, Depends
from app.database.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.database import models
from sqlalchemy.orm import Session

async def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        # Return anonymous user for now to avoid breaking existing flows if any
        return {"id": "anonymous", "email": "guest@example.com", "name": "Guest"}
    
    token = authorization.replace("Bearer ", "")
    
    # Simple token parsing for MVP: "demo-token-{email}"
    if token.startswith("demo-token-"):
        email = token.replace("demo-token-", "")
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "personality_config": user.personality_config
            }
            
    # Fallback or error
    return {"id": "anonymous", "email": "guest@example.com", "name": "Guest"}
