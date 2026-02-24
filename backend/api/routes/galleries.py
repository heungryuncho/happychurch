import os
import json
import shutil
from datetime import datetime, date
from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlmodel import select, desc, func

from api.deps import SessionDep, CurrentAdmin
from models.gallery import Gallery

router = APIRouter()
UPLOAD_DIR = "uploads/galleries"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/")
def read_galleries(
    session: SessionDep, skip: int = 0, limit: int = 12,
    keyword: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> Any:
    count_stmt = select(func.count()).select_from(Gallery)
    query_stmt = select(Gallery)
    
    if keyword:
        count_stmt = count_stmt.where(Gallery.title.contains(keyword))
        query_stmt = query_stmt.where(Gallery.title.contains(keyword))
    if start_date:
        start_dt = datetime.combine(start_date, datetime.min.time())
        count_stmt = count_stmt.where(Gallery.created_at >= start_dt)
        query_stmt = query_stmt.where(Gallery.created_at >= start_dt)
    if end_date:
        end_dt = datetime.combine(end_date, datetime.max.time())
        count_stmt = count_stmt.where(Gallery.created_at <= end_dt)
        query_stmt = query_stmt.where(Gallery.created_at <= end_dt)
    
    total = session.exec(count_stmt).one()
    items = session.exec(query_stmt.order_by(desc(Gallery.created_at)).offset(skip).limit(limit)).all()
    result = []
    for g in items:
        urls = json.loads(g.image_urls) if g.image_urls else []
        result.append({
            "id": g.id,
            "title": g.title,
            "image_url": urls[0] if urls else None,
            "views": g.views,
            "created_at": g.created_at.isoformat(),
        })
    return {"items": result, "total": total}

@router.get("/{gallery_id}")
def read_gallery(gallery_id: int, session: SessionDep) -> Any:
    gallery = session.get(Gallery, gallery_id)
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")
    gallery.views += 1
    session.add(gallery)
    session.commit()
    session.refresh(gallery)
    return {
        "id": gallery.id,
        "title": gallery.title,
        "content": gallery.content,
        "image_urls": json.loads(gallery.image_urls) if gallery.image_urls else [],
        "views": gallery.views,
        "author_id": gallery.author_id,
        "created_at": gallery.created_at.isoformat(),
        "updated_at": gallery.updated_at.isoformat(),
    }

@router.post("/")
def create_gallery(
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
        
    gallery = Gallery(
        title=title,
        content=content,
        image_urls=json.dumps(saved_urls) if saved_urls else None,
        author_id=current_user.id
    )
    session.add(gallery)
    session.commit()
    session.refresh(gallery)
    return gallery

@router.put("/{gallery_id}")
def update_gallery(
    *, session: SessionDep, current_user: CurrentAdmin, gallery_id: int,
    title: Optional[str] = Form(None), content: Optional[str] = Form(None), 
    files: List[UploadFile] = File(default=[])
) -> Any:
    gallery = session.get(Gallery, gallery_id)
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")
        
    if title is not None:
        gallery.title = title
    if content is not None:
        gallery.content = content
    
    new_files = [f for f in files if f.filename]
    if new_files:
        saved_urls = []
        for f in new_files:
            file_path = os.path.join(UPLOAD_DIR, f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{f.filename}")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(f.file, buffer)
            saved_urls.append(f"/{file_path}")
        gallery.image_urls = json.dumps(saved_urls)
        
    gallery.updated_at = datetime.utcnow()
    session.add(gallery)
    session.commit()
    session.refresh(gallery)
    return gallery

@router.delete("/{gallery_id}")
def delete_gallery(*, session: SessionDep, current_user: CurrentAdmin, gallery_id: int) -> Any:
    gallery = session.get(Gallery, gallery_id)
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")
    
    if gallery.image_urls:
        try:
            urls = json.loads(gallery.image_urls)
            for url in urls:
                path = url.lstrip("/")
                if os.path.exists(path):
                    os.remove(path)
        except (json.JSONDecodeError, TypeError):
            pass
        
    session.delete(gallery)
    session.commit()
    return {"message": "Deleted successfully"}
