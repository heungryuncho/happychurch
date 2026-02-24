from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Notice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    content: str
    views: int = Field(default=0)
    
    # We will just record the author_id as integer, but can establish relationship later if needed
    author_id: Optional[int] = Field(default=None, foreign_key="member.id")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
