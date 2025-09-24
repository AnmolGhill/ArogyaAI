"""
Health Profile model - matches the Node.js HealthProfile model exactly
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
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

class HealthProfile(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    userId: str = Field(..., description="Reference to User ID")
    name: Optional[str] = None
    email: EmailStr
    dob: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    bloodType: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    emergencyName: Optional[str] = None
    emergencyRelation: Optional[str] = None
    emergencyPhone: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "userId": "507f1f77bcf86cd799439011",
                "name": "John Doe",
                "email": "john@example.com",
                "dob": "1990-01-01",
                "gender": "male",
                "weight": 70.5,
                "height": 175.0,
                "bloodType": "O+",
                "conditions": "None",
                "medications": "None",
                "allergies": "None",
                "emergencyName": "Jane Doe",
                "emergencyRelation": "Spouse",
                "emergencyPhone": "+1234567890"
            }
        }

class HealthProfileCreate(BaseModel):
    userId: str
    name: Optional[str] = None
    email: EmailStr
    dob: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    bloodType: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    emergencyName: Optional[str] = None
    emergencyRelation: Optional[str] = None
    emergencyPhone: Optional[str] = None

class HealthProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    bloodType: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    emergencyName: Optional[str] = None
    emergencyRelation: Optional[str] = None
    emergencyPhone: Optional[str] = None
