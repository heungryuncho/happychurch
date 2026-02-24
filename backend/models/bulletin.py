from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Bulletin(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    content: Optional[str] = Field(default=None) # Optional if it's just a PDF
    date_info: datetime = Field(default_factory=datetime.utcnow) # e.g., the Sunday of the bulletin
    
    # JSON array of uploaded file URLs, e.g. '["/uploads/bulletins/a.jpg", "/uploads/bulletins/b.jpg"]'
    file_urls: Optional[str] = Field(default=None)
    
    views: int = Field(default=0)
    author_id: Optional[int] = Field(default=None, foreign_key="member.id")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

