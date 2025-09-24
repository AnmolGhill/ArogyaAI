"""
OTP model - matches the Node.js OTP model exactly
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timedelta
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

class OTP(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "otp": "123456"
            }
        }

class OTPCreate(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class SendOTPRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    newPassword: str = Field(..., min_length=6)
