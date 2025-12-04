from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas import ChatRequest
from app.dependencies import get_current_user
from app.services.llm_service import llm_service
import json

router = APIRouter()

@router.post("/")
async def chat_endpoint(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Chat endpoint that accepts a user message and returns a streaming response.
    """
    # 1. Embed user input
    from app.services.embedding_service import embed_texts, get_pinecone_client
    import os
    
    try:
        query_embedding = embed_texts([request.input])[0]
        
        # 2. Retrieve relevant context
        pc = get_pinecone_client()
        index = pc.Index(os.getenv("PINECONE_INDEX"))
        
        results = index.query(
            vector=query_embedding,
            top_k=3,
            include_metadata=True
        )
        
        context_texts = [match.metadata.get("text", "") for match in results.matches if match.metadata]
        context_str = "\n\n".join(context_texts)
        
    except Exception as e:
        print(f"RAG Error: {e}")
        context_str = ""

    # 3. Inject context into system prompt
    system_prompt = "You are Echo, an intelligent AI assistant in the EchoOS workspace. Be helpful, concise, and professional."
    if context_str:
        system_prompt += f"\n\nRelevant Context from Memory:\n{context_str}\n\nUse this context to answer the user's question if relevant."

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.input}
    ]
    
    # 4. Generate response and analyze mood
    # For streaming, we'll yield chunks. We can send mood as a special event or metadata.
    # We'll use Server-Sent Events (SSE) format: data: ...
    
    async def event_generator():
        # Heuristic mood analysis
        user_input_lower = request.input.lower()
        detected_mood = "neutral"
        if any(w in user_input_lower for w in ["stress", "anxious", "worry", "deadline", "busy"]):
            detected_mood = "stressed"
        elif any(w in user_input_lower for w in ["happy", "great", "good", "excited", "love"]):
            detected_mood = "happy"
        elif any(w in user_input_lower for w in ["sad", "bad", "depressed", "unhappy"]):
            detected_mood = "sad"
            
        suggested_action = "Take a break" if detected_mood == "stressed" else None
        
        # Send metadata first
        metadata = {
            "mood": detected_mood,
            "suggested_action": suggested_action
        }
        yield f"event: metadata\ndata: {json.dumps(metadata)}\n\n"
        
        # Stream content
        async for chunk in llm_service.stream_chat(messages):
            if chunk:
                yield f"data: {json.dumps({'content': chunk})}\n\n"
                
        yield "event: done\ndata: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
