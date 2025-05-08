from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from datetime import datetime

from backend.database import Base

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(100), nullable=False)  # changed from hashed_password
    
    @classmethod
    async def create(cls, db: AsyncSession, admin):
        db.add(admin)
        await db.commit()
        await db.refresh(admin)
        return admin
    
    @classmethod
    async def get_by_username(cls, db: AsyncSession, username: str):
        result = await db.execute(select(cls).where(cls.username == username))
        return result.scalars().first()
    
    @classmethod
    async def count(cls, db: AsyncSession):
        result = await db.execute(select(cls))
        return len(result.scalars().all())

class Event(Base):
    __tablename__ = "events"
    
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    datetime = Column(DateTime, nullable=False)
    category = Column(String(50), nullable=False)
    location = Column(String(200), nullable=True)  # <-- add this line
    
    # Relationships
    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")
    
    @classmethod
    async def create(cls, db: AsyncSession, event):
        db.add(event)
        await db.commit()
        await db.refresh(event)
        return event
    
    @classmethod
    async def get_all(cls, db: AsyncSession):
        result = await db.execute(select(cls))
        return result.scalars().all()
    
    @classmethod
    async def get_by_id(cls, db: AsyncSession, event_id: str):
        result = await db.execute(select(cls).where(cls.id == event_id))
        return result.scalars().first()
    
    @classmethod
    async def delete(cls, db: AsyncSession, event_id: str):
        event = await cls.get_by_id(db, event_id)
        if event:
            await db.delete(event)
            await db.commit()
        return True

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    student_id = Column(String(50), nullable=False)
    
    # Relationships
    registrations = relationship("Registration", back_populates="user", cascade="all, delete-orphan")
    
    @classmethod
    async def create(cls, db: AsyncSession, user):
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    
    @classmethod
    async def get_by_id(cls, db: AsyncSession, user_id: str):
        result = await db.execute(select(cls).where(cls.id == user_id))
        return result.scalars().first()

class Registration(Base):
    __tablename__ = "registrations"
    
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    event_id = Column(String(36), ForeignKey("events.id"), nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")
    
    @classmethod
    async def create(cls, db: AsyncSession, registration):
        db.add(registration)
        await db.commit()
        await db.refresh(registration)
        return registration
    
    @classmethod
    async def get_by_id(cls, db: AsyncSession, registration_id: str):
        result = await db.execute(select(cls).where(cls.id == registration_id))
        return result.scalars().first()