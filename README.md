# ArogyaAI 🏥

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg?style=flat&logo=FastAPI)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.1.1-20232a.svg?style=flat&logo=react&logoColor=61dafb)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange.svg?style=flat&logo=firebase)](https://firebase.google.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg?style=flat&logo=python)](https://python.org)

**ArogyaAI** is an intelligent healthcare platform that provides AI-powered medical diagnosis, health monitoring, and personalized healthcare recommendations. Built with modern web technologies and powered by Google's Gemini AI, it offers multilingual support and comprehensive health management features.

## ✨ Features

### 🤖 AI-Powered Diagnosis
- **Intelligent Symptom Analysis**: Advanced AI diagnosis using Google Gemini API
- **Multi-language Support**: Available in English, Hindi (हिंदी), Punjabi (ਪੰਜਾਬੀ), and Odia (ଓଡ଼ିଆ)
- **Interactive Chatbot**: Real-time conversation with AI for symptom assessment
- **Comprehensive Reports**: Detailed diagnosis with recommendations and precautions

### 👤 User Management
- **Firebase Authentication**: Secure user registration and login
- **Profile Management**: Complete health profile with personal information
- **Health Data Tracking**: Weight, height, blood type, and BMI monitoring
- **Session Management**: Secure logout with proper state cleanup

### 🏥 Healthcare Features
- **Health Dashboard**: Personalized dashboard with real-time health metrics
- **BMI Calculator**: Automatic BMI calculation with health status indicators
- **Medical History**: Track and manage your health records
- **Health Recommendations**: Personalized suggestions based on your profile

### 🗺️ Location Services
- **Hospital Finder**: Locate nearby hospitals and healthcare facilities
- **Google Maps Integration**: Interactive maps with real-time location data
- **Geocoding Services**: Address-based location search

### 🌐 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Multi-language Interface**: Complete UI translation support
- **Modern Design**: Clean, intuitive interface with excellent user experience
- **Real-time Updates**: Live data synchronization across the platform

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library with latest features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **FontAwesome & React Icons** - Comprehensive icon libraries
- **Firebase SDK** - Authentication and real-time database

### Backend
- **FastAPI 0.104.1** - High-performance Python web framework
- **Uvicorn** - ASGI server for production deployment
- **Pydantic** - Data validation and serialization
- **Firebase Admin SDK** - Server-side Firebase integration
- **Google Generative AI** - Gemini API for AI-powered diagnosis
- **Python-JOSE** - JWT token handling and cryptography

### Database & Services
- **Firebase Firestore** - NoSQL document database
- **Firebase Authentication** - User management and authentication
- **Google Maps API** - Location and geocoding services
- **Google Gemini AI** - Advanced language model for medical diagnosis

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **Firebase Project** with Firestore and Authentication enabled
- **Google Cloud Project** with Gemini API access
- **Google Maps API Key** (optional, for location features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnmolGhill/ArogyaAI.git
   cd ArogyaAI
   ```

2. **Backend Setup**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

### Configuration

1. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Download the service account key and place it in `server/`
   - Update Firebase config in `client/src/config/firebase.js`

2. **Environment Variables**
   
   Create `server/.env`:
   ```env
   FIREBASE_CREDENTIALS_PATH=path/to/your/firebase-credentials.json
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   CORS_ORIGINS=["http://localhost:5173"]
   ```

3. **Google APIs Setup**
   - Enable Gemini API in Google Cloud Console
   - Enable Maps JavaScript API and Geocoding API
   - Generate API keys and add to environment variables

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   uvicorn main:app --reload --port 8000
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
ArogyaAI/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Main application pages
│   │   ├── contexts/          # React context providers
│   │   ├── services/          # API service functions
│   │   ├── config/            # Configuration files
│   │   └── styles/            # CSS and styling files
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── server/                    # FastAPI backend application
│   ├── app/
│   │   ├── routes/           # API route handlers
│   │   ├── models/           # Pydantic data models
│   │   ├── services/         # Business logic services
│   │   ├── config.py         # Application configuration
│   │   └── database.py       # Database connection
│   ├── main.py               # FastAPI application entry point
│   └── requirements.txt      # Backend dependencies
├── LICENSE                   # MIT License
└── README.md                # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Health & Diagnosis
- `POST /api/get_diagnosis` - AI-powered medical diagnosis
- `GET /api/profile/complete/{user_id}` - Get complete user profile
- `PUT /api/profile/update` - Update user health profile

### Location Services
- `GET /api/maps/geocode` - Geocoding and reverse geocoding
- `GET /api/maps/nearby-hospitals` - Find nearby healthcare facilities

## 🌍 Multi-language Support

ArogyaAI supports multiple languages for both UI and AI diagnosis:

- **English** (en) - Default language
- **Hindi** (hi) - हिंदी में पूर्ण सहायता
- **Punjabi** (pa) - ਪੰਜਾਬੀ ਵਿੱਚ ਪੂਰੀ ਸਹਾਇਤਾ
- **Odia** (or) - ଓଡ଼ିଆରେ ସମ୍ପୂର୍ଣ୍ଣ ସହାୟତା

The AI diagnosis system provides complete responses in the user's selected language, ensuring accessibility for diverse user groups.

## 🔒 Security Features

- **Firebase Authentication** - Industry-standard user authentication
- **JWT Token Management** - Secure API access with token-based authentication
- **Session Management** - Proper logout with complete state cleanup
- **CORS Protection** - Configured cross-origin resource sharing
- **Input Validation** - Comprehensive data validation using Pydantic
- **Environment Variables** - Secure configuration management

## 🚀 Deployment

### Production Deployment

The application is configured for deployment on modern cloud platforms:

1. **Backend Deployment** (Railway, Heroku, or similar)
   ```bash
   # The server includes production-ready configuration
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Frontend Deployment** (Netlify, Vercel, or similar)
   ```bash
   npm run build
   # Deploy the dist/ folder
   ```

3. **Environment Configuration**
   - Update CORS origins for production domains
   - Configure production Firebase settings
   - Set production API endpoints

## 🤝 Contributing

We welcome contributions to ArogyaAI! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anmol Ghill**
- GitHub: [@AnmolGhill](https://github.com/AnmolGhill)

## 🙏 Acknowledgments

- **Google Gemini AI** for providing advanced AI capabilities
- **Firebase** for authentication and database services
- **FastAPI** for the excellent Python web framework
- **React** for the powerful frontend library
- **Open Source Community** for the amazing tools and libraries

## 📞 Support

If you have any questions or need support, please:
1. Check the [Issues](https://github.com/AnmolGhill/ArogyaAI/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

---

**ArogyaAI** - Empowering healthcare through AI technology 🏥✨
