import os
import json
import shutil
from datetime import datetime, date
from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlmodel import select, desc, func
from PIL import Image
import io

from api.deps import SessionDep, CurrentAdmin
from models.bulletin import Bulletin

router = APIRouter()
UPLOAD_DIR = "uploads/bulletins"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_IMAGE_SIZE = (1200, 1200)

def process_and_save_upload(upload_file: UploadFile) -> str:
    """파일이 이미지일 경우 리사이징하고, 문서 등 일반 파일은 해시된 이름으로 그대로 저장"""
    ext = os.path.splitext(upload_file.filename)[1].lower() if upload_file.filename else ".file"
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    file_data = upload_file.file.read()

    # 이미지 파일 형식인지 확인하여 리사이징 시도
    if ext in [".jpg", ".jpeg", ".png", ".webp", ".heic"]:
        # 리사이징 오류 처리를 위해 try-except 블록 사용
        try:
            img = Image.open(io.BytesIO(file_data))
            
            # EXIF 정보 보존 (회전 방지)
            try:
                from PIL import ImageOps
                img = ImageOps.exif_transpose(img)
            except Exception:
                pass
                
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
                
            img.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
            
            # WebP 포맷 또는 JPEG 압축률 높게
            save_format = "WEBP" if ext == ".webp" else "JPEG"
            if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                save_format = "JPEG"
                file_path = os.path.splitext(file_path)[0] + ".jpg"
                
            img.save(file_path, format=save_format, quality=85, optimize=True)
            return f"/{file_path}"
        except Exception as e:
            print(f"이미지 변환 실패: {e}, 원본으로 저장 시도합니다.")
            
    # 문서 파일(PDF 등)이거나 이미지 변환에 실패한 경우 원본 저장
    with open(file_path, "wb") as buffer:
        buffer.write(file_data)
        
    return f"/{file_path}"

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
            saved_url = process_and_save_upload(f)
            saved_urls.append(saved_url)
        
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
            saved_url = process_and_save_upload(f)
            saved_urls.append(saved_url)
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
