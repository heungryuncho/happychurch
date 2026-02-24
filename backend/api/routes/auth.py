from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlmodel import select

from api.deps import SessionDep, CurrentAdmin
from models.member import Member
from schemas import Token
from core.security import verify_password, create_access_token, get_password_hash

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    statement = select(Member).where(Member.email == form_data.username)
    user = session.exec(statement).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
    }

@router.get("/me", response_model=Member)
def read_user_me(current_user: CurrentAdmin) -> Any:
    return current_user

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.put("/change-password")
def change_password(
    *, session: SessionDep, current_user: CurrentAdmin, body: PasswordChange
) -> Any:
    if not verify_password(body.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="현재 비밀번호가 올바르지 않습니다.")
    
    if len(body.new_password) < 4:
        raise HTTPException(status_code=400, detail="새 비밀번호는 4자 이상이어야 합니다.")

    current_user.password_hash = get_password_hash(body.new_password)
    session.add(current_user)
    session.commit()
    return {"message": "비밀번호가 변경되었습니다."}

