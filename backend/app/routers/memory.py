from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import models
from app.database.database import engine
from app.schemas import MemoryCreate, MemoryResponse
from app.dependencies import get_db, get_current_user
from app.services.embedding_service import embed_texts, upsert_vectors
import uuid
from datetime import datetime

# Create tables if they don't exist (for dev simplicity)
models.Base.metadata.create_all(bind=engine)

router = APIRouter()

@router.post("/save", response_model=MemoryResponse)
async def save_memory(
    memory: MemoryCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Save a memory:
    1. Save to Postgres (metadata)
    2. Chunk and embed text
    3. Upsert to Pinecone
    """
    # 1. Save to Postgres
    db_memory = models.Memory(
        user_id=memory.user_id or current_user["id"],
        text=memory.text,
        tags=memory.tags,
        emotion=memory.emotion,
        timestamp=datetime.fromisoformat(memory.timestamp) if memory.timestamp else datetime.utcnow()
    )
    db.add(db_memory)
    db.commit()
    db.refresh(db_memory)

    # 2. Chunk and embed (Simple chunking for now)
    # In a real app, use a proper text splitter
    chunks = [memory.text] # Treating the whole text as one chunk for MVP
    
    try:
        embeddings = embed_texts(chunks)
        
        # 3. Upsert to Pinecone
        # We use the Postgres ID as the vector ID for 1:1 mapping in this simple case
        # If chunking, we'd need a composite ID or separate vector IDs
        upsert_vectors(
            vectors=embeddings,
            metadata=[{
                "text": memory.text,
                "tags": memory.tags,
                "emotion": memory.emotion,
                "user_id": memory.user_id or current_user["id"],
                "memory_id": str(db_memory.id)
            }],
            ids=[str(db_memory.id)]
        )
    except Exception as e:
        # Rollback DB if vector store fails? Or just log error?
        # For now, we'll just log and return success for the DB part
        print(f"Vector store error: {e}")
        # In production, consider a transaction or background job

    return {"id": str(db_memory.id), "status": "saved"}

@router.get("/search")
async def search_memories(
    q: str,
    limit: int = 5,
    current_user: dict = Depends(get_current_user)
):
    """
    Search memories by semantic similarity.
    """
    try:
        query_embedding = embed_texts([q])[0]
        
        # We need to import the pinecone client here or use a service function
        # Let's add a search function to embedding_service.py or do it here
        # For consistency, let's assume we do it here using the client from service
        from app.services.embedding_service import get_pinecone_client
        import os
        
        pc = get_pinecone_client()
        index = pc.Index(os.getenv("PINECONE_INDEX"))
        
        results = index.query(
            vector=query_embedding,
            top_k=limit,
            include_metadata=True
        )
        
        return results.matches
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all")
async def get_all_memories(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all memories for the current user from DB.
    """
    memories = db.query(models.Memory).filter(models.Memory.user_id == current_user["id"]).order_by(models.Memory.timestamp.desc()).limit(limit).all()
    
    return {
        "memories": [
            {
                "id": str(m.id),
                "text": m.text,
                "tags": m.tags,
                "emotion": m.emotion,
                "timestamp": m.timestamp.isoformat(),
                "created_at": m.created_at.isoformat()
            } for m in memories
        ]
    }
