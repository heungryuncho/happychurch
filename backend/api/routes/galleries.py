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
from models.gallery import Gallery

router = APIRouter()
UPLOAD_DIR = "uploads/galleries"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_IMAGE_SIZE = (1200, 1200)

def process_and_save_image(upload_file: UploadFile) -> str:
    """이미지를 리사이징하여 저장하고 경로를 반환합니다."""
    # 파일명 생성
    ext = os.path.splitext(upload_file.filename)[1].lower() if upload_file.filename else ".jpg"
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        ext = ".jpg" # 기본 확장자
    
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # 이미지 열기 및 리사이징
    image_data = upload_file.file.read()
    try:
        img = Image.open(io.BytesIO(image_data))
        
        # EXIF 정보 보존(회전 방지) 후 RGB 변환
        try:
            from PIL import ImageOps
            img = ImageOps.exif_transpose(img)
        except Exception:
            pass
            
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        img.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
        
        # 저장 (WebP나 JPEG로 품질 85)
        save_format = "WEBP" if ext == ".webp" else "JPEG"
        img.save(file_path, format=save_format, quality=85, optimize=True)
        
    except Exception as e:
        # 이미지 처리에 실패하면 원본을 저장
        print(f"Image resize failed: {e}")
        with open(file_path, "wb") as buffer:
            buffer.write(image_data)
            
    return f"/{file_path}"

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
            saved_url = process_and_save_image(f)
            saved_urls.append(saved_url)
        
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
            saved_url = process_and_save_image(f)
            saved_urls.append(saved_url)
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
