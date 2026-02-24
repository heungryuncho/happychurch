from datetime import datetime, date
from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import select, desc, func

from api.deps import SessionDep, CurrentAdmin
from models.notice import Notice
from schemas import NoticeCreate, NoticeUpdate

router = APIRouter()

@router.get("/")
def read_notices(
    session: SessionDep, skip: int = 0, limit: int = 10,
    keyword: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> Any:
    count_stmt = select(func.count()).select_from(Notice)
    query_stmt = select(Notice)
    
    if keyword:
        count_stmt = count_stmt.where(Notice.title.contains(keyword))
        query_stmt = query_stmt.where(Notice.title.contains(keyword))
    if start_date:
        start_dt = datetime.combine(start_date, datetime.min.time())
        count_stmt = count_stmt.where(Notice.created_at >= start_dt)
        query_stmt = query_stmt.where(Notice.created_at >= start_dt)
    if end_date:
        end_dt = datetime.combine(end_date, datetime.max.time())
        count_stmt = count_stmt.where(Notice.created_at <= end_dt)
        query_stmt = query_stmt.where(Notice.created_at <= end_dt)
    
    total = session.exec(count_stmt).one()
    notices = session.exec(query_stmt.order_by(desc(Notice.created_at)).offset(skip).limit(limit)).all()
    return {"items": notices, "total": total}

@router.get("/{notice_id}", response_model=Notice)
def read_notice(notice_id: int, session: SessionDep) -> Any:
    notice = session.get(Notice, notice_id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    notice.views += 1
    session.add(notice)
    session.commit()
    session.refresh(notice)
    return notice

@router.post("/", response_model=Notice)
def create_notice(
    *, session: SessionDep, current_user: CurrentAdmin, notice_in: NoticeCreate
) -> Any:
    notice = Notice.model_validate(notice_in)
    notice.author_id = current_user.id
    session.add(notice)
    session.commit()
    session.refresh(notice)
    return notice

@router.put("/{notice_id}", response_model=Notice)
def update_notice(
    *, session: SessionDep, current_user: CurrentAdmin, notice_id: int, notice_in: NoticeUpdate
) -> Any:
    notice = session.get(Notice, notice_id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    
    update_data = notice_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(notice, field, value)
    
    notice.updated_at = datetime.utcnow()
    session.add(notice)
    session.commit()
    session.refresh(notice)
    return notice

@router.delete("/{notice_id}")
def delete_notice(*, session: SessionDep, current_user: CurrentAdmin, notice_id: int) -> Any:
    notice = session.get(Notice, notice_id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    session.delete(notice)
    session.commit()
    return {"message": "Deleted successfully"}
