from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from datetime import datetime
from typing import Optional

class Member(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(unique=True, index=True)
    password_hash: str
    name: str = Field(index=True)
    role: str = Field(default="USER") # USER or ADMIN
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # In a real project, we add validation or logic on properties
