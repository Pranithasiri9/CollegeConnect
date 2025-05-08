import os
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
from jose import JWTError, jwt
import uuid

from pydantic import BaseModel
from backend.database import get_db, init_db
from backend.models import Admin, Event, Registration, User
from backend.schemas import (
    AdminCreate, EventCreate, EventResponse, 
    RegistrationCreate, RegistrationResponse, Token, UserCreate
)

# Load environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

app = FastAPI(title="College Events API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# JWT token functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    admin = await Admin.get_by_username(db, username)
    if admin is None:
        raise credentials_exception
    return admin

# Startup event
@app.on_event("startup")
async def on_startup():
    await init_db()
    # No sample admins or events will be created

# Authentication
@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    admin = await Admin.get_by_username(db, form_data.username)
    # Compare plain text passwords
    if not admin or form_data.password != admin.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username, "id": admin.id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Event endpoints
@app.get("/api/events", response_model=List[EventResponse])
async def get_events(db: AsyncSession = Depends(get_db)):
    return await Event.get_all(db)

@app.get("/api/events/{event_id}", response_model=EventResponse)
async def get_event(event_id: str, db: AsyncSession = Depends(get_db)):
    event = await Event.get_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.post("/api/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: EventCreate, 
    db: AsyncSession = Depends(get_db),
    _: Admin = Depends(get_current_admin)
):
    event_id = str(uuid.uuid4())
    event = Event(
        id=event_id,
        name=event_data.name,
        description=event_data.description,
        datetime=event_data.datetime,
        category=event_data.category,
        location=event_data.location  # <-- add this
    )
    return await Event.create(db, event)

@app.delete("/api/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: str, 
    db: AsyncSession = Depends(get_db),
    _: Admin = Depends(get_current_admin)
):
    event = await Event.get_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    await Event.delete(db, event_id)
    return {"status": "success"}

@app.get("/api/events/{event_id}/registrations")
async def get_event_registrations(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    _: Admin = Depends(get_current_admin)
):
    event = await Event.get_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    # Get all registrations for this event
    from sqlalchemy import select
    from backend.models import Registration, User
    result = await db.execute(
        select(Registration, User)
        .join(User, Registration.user_id == User.id)
        .where(Registration.event_id == event_id)
    )
    registrations = []
    for reg, user in result.all():
        registrations.append({
            "registration_id": reg.id,
            "registration_date": reg.registration_date,
            "user": {
                "name": user.name,
                "email": user.email,
                "student_id": user.student_id,
                "phone": user.phone,
            }
        })
    return {"registrations": registrations}

# Registration endpoints
@app.post("/api/register/{event_id}", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
async def register_for_event(
    event_id: str,
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    # Check if event exists
    event = await Event.get_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Create user
    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        student_id=user_data.student_id
    )
    await User.create(db, user)
    
    # Create registration
    registration_id = str(uuid.uuid4())
    registration = Registration(
        id=registration_id,
        user_id=user_id,
        event_id=event_id,
        registration_date=datetime.utcnow()
    )
    await Registration.create(db, registration)
    
    return {
        "registration_id": registration_id,
        "event_id": event_id,
        "user_id": user_id,
        "registration_date": registration.registration_date
    }

@app.get("/api/confirmation/{registration_id}", response_model=dict)
async def get_confirmation(registration_id: str, db: AsyncSession = Depends(get_db)):
    registration = await Registration.get_by_id(db, registration_id)
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    user = await User.get_by_id(db, registration.user_id)
    event = await Event.get_by_id(db, registration.event_id)
    
    return {
        "id": registration.id,
        "event": {
            "id": event.id,
            "name": event.name,
            "datetime": event.datetime,
            "category": event.category,
            "location": event.location
        },
        "user": {
            "name": user.name,
            "email": user.email,
            "student_id": user.student_id,
            "phone": user.phone
        },
        "registrationDate": registration.registration_date
    }

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)