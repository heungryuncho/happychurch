from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Happy Church API"
    API_V1_STR: str = "/api/v1"
    
    # Local SQLite
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./happychurch.db"
    # Railway PostgreSQL (from environment variable)
    DATABASE_URL: Optional[str] = None
    
    # JWT Auth — .env 파일에서 반드시 설정해야 합니다
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
