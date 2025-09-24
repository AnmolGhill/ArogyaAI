"""
Configuration settings for the ArogyaAI FastAPI application
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Force reload environment variables
load_dotenv(override=True)

class Settings(BaseSettings):
    # Database Configuration
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/arogyaai")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "arogyaai")
    
    # JWT Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Google AI Configuration
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    
    # Email Configuration
    SMTP_EMAIL: str = os.getenv("SMTP_EMAIL", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    class Config:
        env_file = ".env"

# Global settings instance
settings = Settings()
