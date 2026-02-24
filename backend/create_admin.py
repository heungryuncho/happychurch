import os
from dotenv import load_dotenv
from sqlmodel import Session, select
from core.database import engine, init_db
from models.member import Member
from core.security import get_password_hash

load_dotenv()

def create_admin():
    init_db()
    
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")
    name = os.getenv("ADMIN_NAME", "관리자")
    
    if not email or not password:
        print("오류: .env 파일에 ADMIN_EMAIL과 ADMIN_PASSWORD를 설정해주세요.")
        return
    
    with Session(engine) as session:
        statement = select(Member).where(Member.email == email)
        existing_admin = session.exec(statement).first()
        
        if not existing_admin:
            admin_user = Member(
                email=email,
                password_hash=get_password_hash(password),
                name=name,
                role="ADMIN"
            )
            session.add(admin_user)
            session.commit()
            print(f"Admin user created: {email}")
        else:
            # 기존 관리자의 비밀번호/이름 업데이트
            existing_admin.password_hash = get_password_hash(password)
            existing_admin.name = name
            session.add(existing_admin)
            session.commit()
            print(f"Admin user updated: {email}")

if __name__ == "__main__":
    create_admin()
