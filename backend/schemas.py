from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class NoticeCreate(BaseModel):
    title: str
    content: str
    
class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class BulletinCreate(BaseModel):
    title: str
    # date_info and file_url are processed by Form/UploadFile
    
class GalleryCreate(BaseModel):
    title: str
    content: Optional[str] = None



