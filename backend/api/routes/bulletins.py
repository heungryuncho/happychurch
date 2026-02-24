import os
import json
import shutil
from datetime import datetime, date
from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlmodel import select, desc, func

from api.deps import SessionDep, CurrentAdmin
from models.bulletin import Bulletin

router = APIRouter()
UPLOAD_DIR = "uploads/bulletins"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/")
def read_bulletins(
    session: SessionDep, skip: int = 0, limit: int = 10,
    keyword: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> Any:
    count_stmt = select(func.count()).select_from(Bulletin)
    query_stmt = select(Bulletin)
    
    if keyword:
        count_stmt = count_stmt.where(Bulletin.title.contains(keyword))
        query_stmt = query_stmt.where(Bulletin.title.contains(keyword))
    if start_date:
        start_dt = datetime.combine(start_date, datetime.min.time())
        count_stmt = count_stmt.where(Bulletin.created_at >= start_dt)
        query_stmt = query_stmt.where(Bulletin.created_at >= start_dt)
    if end_date:
        end_dt = datetime.combine(end_date, datetime.max.time())
        count_stmt = count_stmt.where(Bulletin.created_at <= end_dt)
        query_stmt = query_stmt.where(Bulletin.created_at <= end_dt)
    
    total = session.exec(count_stmt).one()
    return {"items": session.exec(query_stmt.order_by(desc(Bulletin.created_at)).offset(skip).limit(limit)).all(), "total": total}

@router.get("/{bulletin_id}")
def read_bulletin(bulletin_id: int, session: SessionDep) -> Any:
    bulletin = session.get(Bulletin, bulletin_id)
    if not bulletin:
        raise HTTPException(status_code=404, detail="Bulletin not found")
    bulletin.views += 1
    session.add(bulletin)
    session.commit()
    session.refresh(bulletin)
    # Parse file_urls JSON for response
    data = {
        "id": bulletin.id,
        "title": bulletin.title,
        "content": bulletin.content,
        "file_urls": json.loads(bulletin.file_urls) if bulletin.file_urls else [],
        "views": bulletin.views,
        "author_id": bulletin.author_id,
        "created_at": bulletin.created_at.isoformat(),
        "updated_at": bulletin.updated_at.isoformat(),
    }
    return data

@router.post("/")
def create_bulletin(
    *, session: SessionDep, current_user: CurrentAdmin,
    title: str = Form(...), content: Optional[str] = Form(None), 
    files: List[UploadFile] = File(default=[])
) -> Any:
    saved_urls = []
    for f in files:
        if f.filename:
            file_path = os.path.join(UPLOAD_DIR, f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{f.filename}")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(f.file, buffer)
            saved_urls.append(f"/{file_path}")
        
    bulletin = Bulletin(
        title=title,
        content=content,
        file_urls=json.dumps(saved_urls) if saved_urls else None,
        author_id=current_user.id
    )
    session.add(bulletin)
    session.commit()
    session.refresh(bulletin)
    return bulletin

@router.put("/{bulletin_id}")
def update_bulletin(
    *, session: SessionDep, current_user: CurrentAdmin, bulletin_id: int,
    title: Optional[str] = Form(None), content: Optional[str] = Form(None), 
    files: List[UploadFile] = File(default=[])
) -> Any:
    bulletin = session.get(Bulletin, bulletin_id)
    if not bulletin:
        raise HTTPException(status_code=404, detail="Bulletin not found")
        
    if title is not None:
        bulletin.title = title
    if content is not None:
        bulletin.content = content
    
    # Check if new files were uploaded (non-empty filenames)
    new_files = [f for f in files if f.filename]
    if new_files:
        saved_urls = []
        for f in new_files:
            file_path = os.path.join(UPLOAD_DIR, f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{f.filename}")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(f.file, buffer)
            saved_urls.append(f"/{file_path}")
        bulletin.file_urls = json.dumps(saved_urls)
        
    bulletin.updated_at = datetime.utcnow()
    session.add(bulletin)
    session.commit()
    session.refresh(bulletin)
    return bulletin

@router.delete("/{bulletin_id}")
def delete_bulletin(*, session: SessionDep, current_user: CurrentAdmin, bulletin_id: int) -> Any:
    bulletin = session.get(Bulletin, bulletin_id)
    if not bulletin:
        raise HTTPException(status_code=404, detail="Bulletin not found")
    # Remove uploaded files
    if bulletin.file_urls:
        try:
            urls = json.loads(bulletin.file_urls)
            for url in urls:
                path = url.lstrip("/")
                if os.path.exists(path):
                    os.remove(path)
        except (json.JSONDecodeError, TypeError):
            pass
        
    session.delete(bulletin)
    session.commit()
    return {"message": "Deleted successfully"}
