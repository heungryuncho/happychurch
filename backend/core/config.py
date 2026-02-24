from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Happy Church API"
    API_V1_STR: str = "/api/v1"
    
    # SQLite Database
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./happychurch.db"
    
    # JWT Auth — .env 파일에서 반드시 설정해야 합니다
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
