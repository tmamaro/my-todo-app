from pydantic import BaseModel  # Add this import
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func  # ✅ Import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Models
class Task(Base):
    __tablename__ = 'tasks'
    __table_args__ = {"schema": "todo_db"}  # <-- Explicit schema

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())  # Use func.now()
    
class TaskCreate(BaseModel):
    title: str
    is_completed: bool

class TaskUpdate(BaseModel):
    is_completed: bool