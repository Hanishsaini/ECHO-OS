from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, memory, agents, auth, files, payments, twin, tasks


app = FastAPI(title="EchoOS Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
# Mount routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(memory.router, prefix="/api/memory", tags=["memory"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(files.router, prefix="/api/files", tags=["files"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
app.include_router(twin.router, prefix="/api/twin", tags=["twin"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])


@app.get("/")
async def root():
    return {"message": "Welcome to EchoOS API"}
