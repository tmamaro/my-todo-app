from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from typing import Optional

Base = declarative_base()

class Task(Base):
    __tablename__ = 'tasks'
    __table_args__ = {"schema": "todo_db"}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    notes = Column(String, nullable=True)  # Added 'notes' column
    is_completed = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

class TaskCreate(BaseModel):
    title: str
    is_completed: bool
    notes: str  # Include notes in task creation

class TaskUpdate(BaseModel):
    is_completed: Optional[bool] = None
    notes: Optional[str] = None  # Allow updating only notes

class TaskNotesUpdate(BaseModel):
    notes: Optional[str] = None
