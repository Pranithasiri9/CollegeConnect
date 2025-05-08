from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Admin schemas
class AdminBase(BaseModel):
    username: str

class AdminCreate(AdminBase):
    password: str

class AdminResponse(AdminBase):
    id: int
    
    class Config:
        from_attributes = True

# Event schemas
class EventBase(BaseModel):
    name: str
    description: str
    datetime: datetime
    category: str
    location: str  # now required

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: str
    
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    name: str
    email: str
    phone: str
    student_id: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: str
    
    class Config:
        from_attributes = True

# Registration schemas
class RegistrationBase(BaseModel):
    user_id: str
    event_id: str

class RegistrationCreate(RegistrationBase):
    pass

class RegistrationResponse(BaseModel):
    registration_id: str
    user_id: str
    event_id: str
    registration_date: datetime
    
    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None