from database import engine  # Import the engine from database.py
from models import Base  # Import Base from models.py

# Create all tables
def init_db():
    print("Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized.")

# Execute the database initialization
if __name__ == "__main__":
    init_db()
