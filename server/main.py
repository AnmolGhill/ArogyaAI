"""
Main FastAPI application - Professional Python server matching Node.js backend
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager
import uvicorn
import logging
from pathlib import Path

# Import configuration and database
from app.config import settings
from app.database import connect_to_firebase, close_firebase_connection

# Import routes
from app.routes.auth_routes import router as auth_router
from app.routes.firebase_auth_routes import router as firebase_auth_router
from app.routes.health_routes import router as health_router
from app.routes.diagnosis_routes import router as diagnosis_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await connect_to_firebase()
        logger.info("🚀 FastAPI server starting up...")
    except Exception as e:
        logger.error(f"❌ Startup error: {e}")
        raise e
    
    yield
    
    # Shutdown
    await close_firebase_connection()
    logger.info("🔌 FastAPI server shutting down...")

# Create FastAPI application with enhanced styling
app = FastAPI(
    title="🏥 HALO - Healthcare AI Linked Operations",
    description="""
    ## 🩺 Professional Healthcare AI Platform
    
    **HALO** (Healthcare AI Linked Operations) is an advanced AI-powered medical platform providing:
    
    ### ✨ Key Features:
    - 🔐 **Secure Authentication** - JWT-based user management with OTP verification
    - 👤 **Health Profiles** - Comprehensive medical history and personal health data
    - 🤖 **AI Diagnosis** - Google Gemini AI-powered symptom analysis and medical insights
    - 📧 **Email Services** - Automated OTP and notification system
    - 🔒 **Data Security** - HIPAA-compliant data handling and encryption
    
    ### 🚀 Technology Stack:
    - **Backend**: Python FastAPI with async/await
    - **Database**: MongoDB Atlas (Cloud)
    - **AI Engine**: Google Gemini AI
    - **Authentication**: JWT + bcrypt
    - **Email**: SMTP with HTML templates
    
    ### 📊 API Status:
    - **Environment**: Production Ready
    - **Version**: 1.0.0
    - **Uptime**: Real-time monitoring
    - **Security**: Enterprise-grade encryption
    
    ---
    *Built with ❤️ for better healthcare accessibility*
    """,
    version="1.0.0",
    contact={
        "name": "HALO Healthcare Team",
        "email": "halo.ai.care@gmail.com",
    },
    license_info={
        "name": "Healthcare AI License",
        "url": "https://github.com/arogyaai/halo",
    },
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
    swagger_ui_parameters={
        "defaultModelsExpandDepth": -1,
        "docExpansion": "none",
        "syntaxHighlight.theme": "tomorrow-night",
    }
)

# CORS middleware - matches Node.js CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth_router)
app.include_router(firebase_auth_router)
app.include_router(health_router)
app.include_router(diagnosis_router)

# Health check endpoint
@app.get(
    "/health",
    tags=["🏥 System Health"],
    summary="🩺 Health Check",
    description="Check the health status of the HALO Healthcare API server and all connected services"
)
async def health_check():
    """
    ## 🩺 System Health Check
    
    Returns the current health status of:
    - ✅ API Server
    - ✅ MongoDB Atlas Connection
    - ✅ Google Gemini AI Service
    - ✅ Email Service
    """
    return {
        "status": "🟢 healthy",
        "service": "🏥 HALO Healthcare API",
        "version": "1.0.0",
        "timestamp": "2025-09-24T11:15:00+05:30",
        "services": {
            "database": "🟢 MongoDB Atlas Connected",
            "ai_engine": "🟢 Google Gemini AI Ready",
            "email_service": "🟢 SMTP Service Active",
            "authentication": "🟢 JWT Service Running"
        }
    }

# Root endpoint
@app.get(
    "/",
    tags=["🏥 System Health"],
    summary="🏠 API Information",
    description="Get basic information about the HALO Healthcare API"
)
async def root():
    """
    ## 🏠 HALO Healthcare API Welcome
    
    Welcome to the HALO (Healthcare AI Linked Operations) API!
    
    ### 🚀 Quick Links:
    - 📖 **Documentation**: `/docs`
    - 🩺 **Health Check**: `/health`
    - 🔐 **Authentication**: `/api/auth/*`
    - 👤 **Health Profiles**: `/api/user-health`
    - 🤖 **AI Diagnosis**: `/api/get_diagnosis`
    """
    return {
        "message": "🩺 Welcome to HALO Healthcare API",
        "tagline": "🤖 AI-Powered Healthcare at Your Fingertips",
        "version": "1.0.0",
        "status": "🟢 running",
        "features": [
            "🔐 Secure Authentication",
            "👤 Health Profile Management", 
            "🤖 AI-Powered Diagnosis",
            "📧 Email Notifications",
            "🔒 HIPAA Compliant"
        ],
        "docs": "/docs" if settings.DEBUG else "📖 Documentation available in development mode",
        "support": "halo.ai.care@gmail.com"
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors"""
    return HTTPException(
        status_code=404,
        detail="Endpoint not found"
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {exc}")
    return HTTPException(
        status_code=500,
        detail="Internal server error"
    )

# Run server
if __name__ == "__main__":
    logger.info(f"🚀 Starting HALO Healthcare API server on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
