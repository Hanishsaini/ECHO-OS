from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import models
from app.dependencies import get_db, get_current_user
from datetime import datetime
import uuid

router = APIRouter()

class TaskCreate(BaseModel):
    title: str
    priority: Optional[str] = "medium"
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None

@router.get("/")
async def get_tasks(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    tasks = db.query(models.Task).filter(models.Task.user_id == current_user["id"]).order_by(models.Task.created_at.desc()).all()
    return tasks

@router.post("/")
async def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_task = models.Task(
        user_id=current_user["id"],
        title=task.title,
        priority=task.priority,
        due_date=task.due_date,
        status="pending"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}")
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user["id"]).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task_update.status:
        db_task.status = task_update.status
    if task_update.priority:
        db_task.priority = task_update.priority
        
    db.commit()
    db.refresh(db_task)
    return db_task
