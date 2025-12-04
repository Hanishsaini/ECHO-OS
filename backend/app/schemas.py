from pydantic import BaseModel
from typing import Optional, List

class ChatRequest(BaseModel):
    user_id: Optional[str] = None
    input: str
    context_ids: Optional[List[str]] = None

class MemoryCreate(BaseModel):
    user_id: Optional[str] = None
    text: str
    tags: Optional[List[str]] = []
    emotion: Optional[str] = "neutral"
    timestamp: Optional[str] = None # ISO format string

class MemoryResponse(BaseModel):
    id: str
    status: str

class CheckoutRequest(BaseModel):
    user_id: str
    plan_id: str


