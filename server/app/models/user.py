"""
User model - matches the Node.js User model exactly
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, Annotated
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class OTPInfo(BaseModel):
    code: Optional[str] = None
    expiresAt: Optional[datetime] = None

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=3)
    age: int = Field(..., ge=17, le=45)
    email: EmailStr
    password: str = Field(..., min_length=6)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    otp: Optional[OTPInfo] = None

    @field_validator('name')
    @classmethod
    def name_must_be_trimmed(cls, v):
        return v.strip()

    @field_validator('email')
    @classmethod
    def email_must_be_lowercase(cls, v):
        return v.lower().strip()

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "age": 25,
                "email": "john@example.com",
                "password": "securepassword123"
            }
        }

class UserCreate(BaseModel):
    name: str = Field(..., min_length=3)
    age: int = Field(..., ge=17, le=45)
    email: EmailStr
    password: str = Field(..., min_length=6)

    @field_validator('name')
    @classmethod
    def name_must_be_trimmed(cls, v):
        return v.strip()

    @field_validator('email')
    @classmethod
    def email_must_be_lowercase(cls, v):
        return v.lower().strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator('email')
    @classmethod
    def email_must_be_lowercase(cls, v):
        return v.lower().strip()

class UserResponse(BaseModel):
    userId: str
    name: str
    email: str
    message: str

class UserInDB(User):
    hashed_password: str
