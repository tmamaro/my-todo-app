from fastapi import FastAPI, Depends 
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from models import Task, TaskCreate  # Ensure you import your models
from database import get_db  # Your database session function

# FastAPI app
app = FastAPI()

# Allow CORS for all origins (or specify your front-end URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks

@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(title=task.title, is_completed=task.is_completed)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
