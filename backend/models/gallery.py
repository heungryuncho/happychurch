from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Gallery(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    content: Optional[str] = Field(default=None)
    
    # JSON array of uploaded image URLs
    image_urls: Optional[str] = Field(default=None)
    
    views: int = Field(default=0)
    author_id: Optional[int] = Field(default=None, foreign_key="member.id")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

