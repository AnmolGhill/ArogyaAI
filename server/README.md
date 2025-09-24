# HALO Healthcare API - Python FastAPI Backend

Professional Python FastAPI server that exactly matches the Node.js backend functionality for the ArogyaAI healthcare platform.

## 🏗️ Project Structure

```
server/
├── app/
│   ├── __init__.py
│   ├── config.py              # Configuration settings
│   ├── database.py            # MongoDB connection
│   ├── models/                # Pydantic models
│   │   ├── user.py           # User model (matches Node.js User)
│   │   ├── health_profile.py # Health profile model
│   │   ├── otp.py            # OTP model
│   │   └── diagnosis.py      # Diagnosis models
│   ├── routes/               # API routes
│   │   ├── auth_routes.py    # Authentication endpoints
│   │   ├── health_routes.py  # Health profile endpoints
│   │   └── diagnosis_routes.py # AI diagnosis endpoints
│   ├── services/             # Business logic services
│   │   └── gemini_service.py # Google Gemini AI integration
│   └── utils/                # Utility functions
│       ├── auth.py           # JWT & password utilities
│       ├── otp_generator.py  # OTP generation
│       └── email_service.py  # Email sending service
├── main.py                   # FastAPI application entry point
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Required Environment Variables

```env
# Database
MONGO_URI=mongodb://localhost:27017/arogyaai
DATABASE_NAME=arogyaai

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google AI
GOOGLE_API_KEY=your-google-api-key-here

# Email
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### 4. Run the Server

```bash
# Development mode
python main.py

# Or using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Health Profile Routes (`/api`)
- `POST /api/update-health` - Save/update health profile
- `GET /api/user-health?userId=<id>` - Get user health profile

### Diagnosis Routes (`/api`)
- `POST /api/get_diagnosis` - Get AI diagnosis from symptoms
- `POST /api/test-ai` - Test Gemini AI connection

### System Routes
- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - API documentation (development only)

## 🔧 Features

### ✅ Exact Node.js Compatibility
- Same API endpoints and request/response formats
- Identical error handling and status codes
- Matching database schema and operations
- Same authentication and security patterns

### 🛡️ Security Features
- JWT token authentication
- Password hashing with bcrypt
- Input validation with Pydantic
- CORS configuration
- Environment-based configuration

### 🤖 AI Integration
- Google Gemini AI for medical diagnosis
- Structured HTML response format
- Error handling and fallbacks
- Connection testing endpoint

### 📧 Email Services
- OTP email sending
- SMTP configuration
- HTML email templates
- Error handling and logging

### 🗄️ Database
- MongoDB with Motor (async driver)
- Connection pooling and management
- Automatic reconnection
- Error handling and logging

## 🔄 Migration from Node.js

This Python FastAPI server is a **drop-in replacement** for the Node.js backend:

1. **Same API endpoints** - All routes match exactly
2. **Same request/response formats** - No frontend changes needed
3. **Same database schema** - Uses existing MongoDB collections
4. **Same functionality** - All features preserved
5. **Same environment variables** - Easy configuration migration

## 🧪 Testing

```bash
# Test API health
curl http://localhost:8000/health

# Test AI connection (requires GOOGLE_API_KEY)
curl -X POST http://localhost:8000/api/test-ai

# View API documentation
open http://localhost:8000/docs
```

## 📝 Logging

The server provides comprehensive logging:
- Request/response logging
- Database operation logs
- Error tracking and debugging
- Service status monitoring

## 🔧 Production Deployment

1. Set `DEBUG=False` in environment
2. Use production MongoDB URI
3. Configure proper CORS origins
4. Set strong SECRET_KEY
5. Use process manager (PM2, systemd, etc.)
6. Set up reverse proxy (nginx, Apache)
7. Enable HTTPS/SSL

## 🤝 Contributing

This server maintains exact compatibility with the Node.js backend. When making changes:

1. Ensure API compatibility
2. Match error responses exactly
3. Maintain database schema consistency
4. Update documentation
5. Test with existing frontend

## 📄 License

This project is part of the ArogyaAI healthcare platform.
