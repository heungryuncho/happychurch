from fastapi import APIRouter
from .routes import auth, notices, bulletins, galleries

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(notices.router, prefix="/notices", tags=["notices"])
api_router.include_router(bulletins.router, prefix="/bulletins", tags=["bulletins"])
api_router.include_router(galleries.router, prefix="/galleries", tags=["galleries"])

