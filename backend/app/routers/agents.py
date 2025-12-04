from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from app.services.agent_runtime import run_agent_async
from app.dependencies import get_current_user

router = APIRouter()

class AgentRunRequest(BaseModel):
    agent_id: str
    input: str
    context: Optional[Dict[str, Any]] = None

class Agent(BaseModel):
    id: str
    name: str
    description: str
    status: str

@router.get("/", response_model=List[Agent])
async def get_agents(current_user: dict = Depends(get_current_user)):
    """
    List available agents.
    """
    return [
        {
            "id": "research",
            "name": "Research Agent",
            "description": "Capable of searching the web and summarizing information.",
            "status": "active"
        },
        {
            "id": "coding",
            "name": "Coding Assistant",
            "description": "Helps with code generation and debugging.",
            "status": "coming_soon"
        }
    ]

@router.post("/run")
async def run_agent_endpoint(
    request: AgentRunRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Execute a specific agent.
    """
    try:
        result_json_str = await run_agent_async(request.agent_id, request.input, request.context)
        import json
        try:
            result_data = json.loads(result_json_str)
        except json.JSONDecodeError:
            result_data = {"summary": result_json_str, "suggested_tasks": []}
            
        return {"result": result_data, "status": "success"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
