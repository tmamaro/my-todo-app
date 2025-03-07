from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserCreate  # Ensure User model exists
import os

# Secret key & algorithm for JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_default_secret_key")  # Store this securely
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expiration

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter(prefix="/auth", tags=["auth"])

# Helper function to hash passwords
def get_password_hash(password: str):
    return pwd_context.hash(password)

# Helper function to verify passwords
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Generate JWT token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Get current user from token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# User registration route
@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"username": user_data.email, "message": "User registered successfully"}

#@app.post("/register")
#async def register(user: UserCreate):
    # Here you would hash the password and store it in the database
    # For example, using bcrypt:
    # hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
#
#     return {"username": user.username, "message": "User registered successfully"}

# Example of password validation
#@app.post("/login")
#async def login(username: str, password: str):
    # Check password length (though Pydantic already validates this)
#    if len(password) < 8 or len(password) > 64:
#        raise HTTPException(status_code=400, detail="Password must be between 8 and 64 characters")
    
    # Verify the password against the hashed password in the database
    # For example, using bcrypt:
    # if not bcrypt.checkpw(password.encode('utf-8'), hashed_password_from_db):
    #     raise HTTPException(status_code=401, detail="Incorrect password")
    
#    return {"message": "Login successful"}

# Login route
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}
