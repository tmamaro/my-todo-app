from fastapi import FastAPI, Depends, HTTPException, status
from auth import router as auth_router, get_current_user  # Import auth router and get_current_user
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from models import Task, TaskCreate, TaskUpdate, TaskNotesUpdate  # Ensure you import your models
from database import get_db  # Your database session function

app = FastAPI()

# Include auth routes
app.include_router(auth_router)

# Allow CORS for all origins (or specify your front-end URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # You can replace "*" with specific origins like ["http://localhost:3000"] -> my frontend host
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/tasks") #, dependencies=[Depends(get_current_user)])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks

@app.post("/tasks", status_code=status.HTTP_201_CREATED) #, dependencies=[Depends(get_current_user)])
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(title=task.title, is_completed=task.is_completed)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/tasks/{task_id}")
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)): #, dependencies=[Depends(get_current_user)])
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    # Only update fields that are provided
    if task.is_completed is not None:
        db_task.is_completed = task.is_completed
    if task.notes is not None:
        db_task.notes = task.notes
    db.commit()
    db.refresh(db_task)
    return db_task
    
@app.patch("/tasks/{task_id}/notes")
def update_task_notes(task_id: int, task_notes: TaskNotesUpdate, db: Session = Depends(get_db)): #, dependencies=[Depends(get_current_user)])
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_notes.notes is not None:
        db_task.notes = task_notes.notes  # Update only notes
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)): #, dependencies=[Depends(get_current_user)])
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return db_task