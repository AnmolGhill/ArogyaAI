"""
Diagnosis model for AI-powered symptom analysis
"""
from pydantic import BaseModel, Field
from typing import List, Optional

class DiagnosisRequest(BaseModel):
    symptoms: str = Field(..., description="Comma-separated list of symptoms")
    
    class Config:
        schema_extra = {
            "example": {
                "symptoms": "headache, fever, cough, fatigue"
            }
        }

class DiagnosisResponse(BaseModel):
    response: str = Field(..., description="HTML formatted diagnosis response")
    
    class Config:
        schema_extra = {
            "example": {
                "response": "<div><h3>Diagnosis Summary</h3><p>Based on your symptoms...</p></div>"
            }
        }
