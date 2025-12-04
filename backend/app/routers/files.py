from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.dependencies import get_current_user
import shutil
import os
import uuid
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload a file to the server.
    """
    try:
        # Generate a safe filename
        file_ext = os.path.splitext(file.filename)[1]
        file_id = str(uuid.uuid4())
        safe_filename = f"{file_id}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {
            "id": file_id,
            "filename": file.filename,
            "saved_as": safe_filename,
            "size": os.path.getsize(file_path),
            "uploaded_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@router.get("/")
async def list_files(current_user: dict = Depends(get_current_user)):
    """
    List uploaded files (mock metadata for now since we don't have a DB table for files yet).
    """
    # In a real app, query the DB. Here we just list the directory.
    files = []
    if os.path.exists(UPLOAD_DIR):
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            files.append({
                "filename": filename,
                "size": os.path.getsize(file_path),
                "path": file_path
            })
    return files
