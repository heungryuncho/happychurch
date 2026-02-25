from sqlmodel import SQLModel, create_engine, Session
from core.config import settings

# Railway에서 주는 DATABASE_URL이 있으면 그걸 사용하고, 없으면 로컬 SQLite 사용
database_url = settings.DATABASE_URL or settings.SQLALCHEMY_DATABASE_URI

# psycopg2 드라이버를 인식하도록 postgres:// 를 postgresql:// 로 변환
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

connect_args = {}
# SQLite인 경우에만 check_same_thread 옵션 필요 (PostgreSQL은 이 옵션이 있으면 에러 발생)
if database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    database_url, 
    echo=True, 
    connect_args=connect_args
)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
