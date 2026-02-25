import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from core.database import init_db
from api.main import api_router

os.makedirs("uploads", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database when application starts
    init_db()
    yield
    # Cleanup here if necessary

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "https://happychurch-tau.vercel.app" # 명시적 도메인 추가
    ], 
    allow_origin_regex="https://happychurch.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to Happy Church API"}
