from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from models import Base  # Import Base here from models

# Define the database URL (replace with your database details)
DATABASE_URL = "postgresql://tmamaro:TAProjectToDos@db:5432/todo_db"

# Create an engine
engine = create_engine(DATABASE_URL)

# Ensure schema exists before using it
with engine.connect() as conn:
    conn.execute(text("CREATE SCHEMA IF NOT EXISTS todo_db;"))
    conn.commit()
    
# Automatically create tables inside the schema
Base.metadata.create_all(bind=engine)

# Create a sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Set search_path when creating a session
from typing import Generator

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        db.execute(text("SET search_path TO todo_db"))  # Use text() for raw SQL
        yield db
    finally:
        db.close()

