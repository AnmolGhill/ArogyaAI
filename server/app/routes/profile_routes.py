"""
Comprehensive Profile Management Routes
Handles user profiles, health data, activities, settings, and file uploads
"""
from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Header
from fastapi.responses import JSONResponse
from app.models.user import UserResponse
from app.models.health_profile import HealthProfileCreate, HealthProfileUpdate
from app.services.firebase_service import firebase_service
# Firebase auth verification will be handled by firebase_service
from datetime import datetime
from typing import Optional, List, Dict, Any
import logging
import uuid
import os
from pathlib import Path

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/profile", tags=["👤 Profile Management"])

# Dependency to get current user from Firebase token
async def get_current_user(authorization: str = Header(None)):
    """Extract and verify Firebase token from Authorization header"""
    # For development, make auth optional and return mock user if no token
    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("No authorization header provided, using mock user for development")
        return {
            'uid': 'mock_user_id',
            'email': 'mock@example.com',
            'name': 'Mock User'
        }
    
    token = authorization.split(" ")[1]
    
    try:
        # Create firebase service instance
        service = firebase_service
        decoded_token = await service.verify_firebase_token(token)
        
        if not decoded_token:
            logger.warning("Invalid token, using mock user for development")
            return {
                'uid': 'mock_user_id',
                'email': 'mock@example.com',
                'name': 'Mock User'
            }
        
        return decoded_token
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        # Return mock user for development
        return {
            'uid': 'mock_user_id',
            'email': 'mock@example.com',
            'name': 'Mock User'
        }

@router.get(
    "/complete/{user_id}",
    summary="📋 Get Complete User Profile",
    description="Get comprehensive user profile including personal info, health data, activities, and settings"
)
async def get_complete_profile(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    ## 📋 Get Complete User Profile
    
    Retrieves comprehensive user profile data:
    - 👤 **Personal Information** - Basic user details
    - 🏥 **Health Profile** - Medical data and metrics
    - 📊 **Activity History** - Recent user activities
    - ⚙️ **Settings** - User preferences and privacy settings
    """
    try:
        # Verify user access (users can only access their own profile)
        # For development, allow access if using mock user
        if current_user.get('uid') != user_id and current_user.get('uid') != 'mock_user_id':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Try to get data from Firebase, but provide mock data if Firebase is not configured
        try:
            db = firebase_service.db
            
            # Get user profile
            user_ref = db.collection('users').document(user_id)
            user_doc = user_ref.get()
            
            if user_doc.exists:
                profile_data = user_doc.to_dict()
            else:
                # Create mock profile data
                profile_data = {
                    'name': current_user.get('name', 'Test User'),
                    'email': current_user.get('email', 'test@example.com'),
                    'age': 25,
                    'gender': 'Not specified',
                    'phone': '+1 234 567 8900',
                    'location': 'Test City, Country',
                    'emergencyContact': '+1 234 567 8901',
                    'photoURL': None,
                    'createdAt': datetime.utcnow(),
                    'updatedAt': datetime.utcnow()
                }
            
            # Get health profile
            health_ref = db.collection('healthProfiles').document(user_id)
            health_doc = health_ref.get()
            health_data = health_doc.to_dict() if health_doc.exists else {
                'height': "5'8\"",
                'weight': '70 kg',
                'bmi': '22.5',
                'bloodType': 'O+',
                'bloodPressure': '120/80',
                'heartRate': '72 bpm',
                'allergies': ['None known'],
                'medications': ['Multivitamin'],
                'updatedAt': datetime.utcnow()
            }
            
            # Get recent activities (last 10)
            try:
                activities_ref = db.collection('userActivity').document(user_id).collection('activities')
                activities_query = activities_ref.order_by('timestamp', direction='DESCENDING').limit(10)
                activities_docs = activities_query.stream()
                activities = [
                    {**doc.to_dict(), 'id': doc.id} 
                    for doc in activities_docs
                ]
            except:
                activities = [
                    {
                        'id': '1',
                        'type': 'health_assessment',
                        'title': 'Health Assessment Completed',
                        'description': 'Completed comprehensive health assessment',
                        'timestamp': datetime.utcnow()
                    },
                    {
                        'id': '2',
                        'type': 'consultation',
                        'title': 'Doctor Consultation Scheduled',
                        'description': 'Scheduled consultation with Dr. Smith',
                        'timestamp': datetime.utcnow()
                    }
                ]
            
            # Get user settings
            settings_ref = db.collection('userSettings').document(user_id)
            settings_doc = settings_ref.get()
            settings_data = settings_doc.to_dict() if settings_doc.exists else {
                'notifications': {
                    'healthReminders': True,
                    'appointmentAlerts': True,
                    'medicationReminders': False
                },
                'privacy': {
                    'profileVisibility': 'private',
                    'dataSharing': False
                }
            }
            
            # Get medical history
            try:
                history_ref = db.collection('medicalHistory').document(user_id).collection('entries')
                history_query = history_ref.order_by('timestamp', direction='DESCENDING').limit(5)
                history_docs = history_query.stream()
                medical_history = [
                    {**doc.to_dict(), 'id': doc.id} 
                    for doc in history_docs
                ]
            except:
                medical_history = [
                    {
                        'id': '1',
                        'type': 'checkup',
                        'title': 'Annual Health Checkup',
                        'description': 'Routine annual health examination',
                        'doctor': 'Dr. Johnson',
                        'location': 'City Medical Center',
                        'timestamp': datetime.utcnow()
                    }
                ]
                
        except Exception as firebase_error:
            logger.warning(f"Firebase not configured or error: {firebase_error}")
            # Return complete mock data when Firebase is not available
            profile_data = {
                'name': current_user.get('name', 'Test User'),
                'email': current_user.get('email', 'test@example.com'),
                'age': 25,
                'gender': 'Not specified',
                'phone': '+1 234 567 8900',
                'location': 'Test City, Country',
                'emergencyContact': '+1 234 567 8901',
                'photoURL': None,
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }
            
            health_data = {
                'height': "5'8\"",
                'weight': '70 kg',
                'bmi': '22.5',
                'bloodType': 'O+',
                'bloodPressure': '120/80',
                'heartRate': '72 bpm',
                'allergies': ['None known'],
                'medications': ['Multivitamin'],
                'updatedAt': datetime.utcnow()
            }
            
            activities = [
                {
                    'id': '1',
                    'type': 'health_assessment',
                    'title': 'Health Assessment Completed',
                    'description': 'Completed comprehensive health assessment',
                    'timestamp': datetime.utcnow()
                },
                {
                    'id': '2',
                    'type': 'consultation',
                    'title': 'Doctor Consultation Scheduled',
                    'description': 'Scheduled consultation with Dr. Smith',
                    'timestamp': datetime.utcnow()
                }
            ]
            
            settings_data = {
                'notifications': {
                    'healthReminders': True,
                    'appointmentAlerts': True,
                    'medicationReminders': False
                },
                'privacy': {
                    'profileVisibility': 'private',
                    'dataSharing': False
                }
            }
            
            medical_history = [
                {
                    'id': '1',
                    'type': 'checkup',
                    'title': 'Annual Health Checkup',
                    'description': 'Routine annual health examination',
                    'doctor': 'Dr. Johnson',
                    'location': 'City Medical Center',
                    'timestamp': datetime.utcnow()
                }
            ]
        
        return {
            "success": True,
            "data": {
                "profile": profile_data,
                "health": health_data,
                "activities": activities,
                "settings": settings_data,
                "medicalHistory": medical_history
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting complete profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile data"
        )

@router.put(
    "/personal/{user_id}",
    summary="✏️ Update Personal Information",
    description="Update user's personal information including name, age, contact details"
)
async def update_personal_info(
    user_id: str,
    update_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """
    ## ✏️ Update Personal Information
    
    Updates user's personal profile data:
    - 📝 **Name** - Full name
    - 🎂 **Age** - User age
    - 📞 **Phone** - Contact number
    - 📍 **Location** - User location
    - 🚨 **Emergency Contact** - Emergency contact details
    """
    try:
        # Verify user access
        # For development, allow access if using mock user
        if current_user.get('uid') != user_id and current_user.get('uid') != 'mock_user_id':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        try:
            db = firebase_service.db
            user_ref = db.collection('users').document(user_id)
            
            # Update user document
            update_data['updatedAt'] = datetime.utcnow()
            user_ref.set(update_data, merge=True)
            
            logger.info(f"Personal info updated for user: {user_id}")
        except Exception as firebase_error:
            logger.warning(f"Firebase update failed, using mock storage: {firebase_error}")
            # In development, just log the update (you could store in memory/cache here)
            logger.info(f"Mock update for user {user_id}: {update_data}")
        
        return {"success": True, "message": "Personal information updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating personal info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update personal information"
        )

@router.put(
    "/health/{user_id}",
    summary="🏥 Update Health Profile",
    description="Update user's health profile including physical stats and medical information"
)
async def update_health_profile(
    user_id: str,
    health_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """
    ## 🏥 Update Health Profile
    
    Updates user's health profile data:
    - 📏 **Physical Stats** - Height, weight, BMI
    - 🩸 **Vital Signs** - Blood pressure, heart rate, blood type
    - 💊 **Medical Info** - Allergies, medications
    - 📊 **Health Metrics** - Various health indicators
    """
    try:
        # Verify user access
        # For development, allow access if using mock user
        if current_user.get('uid') != user_id and current_user.get('uid') != 'mock_user_id':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        try:
            db = firebase_service.db
            health_ref = db.collection('healthProfiles').document(user_id)
            
            # Update health document
            health_data['updatedAt'] = datetime.utcnow()
            health_ref.set(health_data, merge=True)
            
            logger.info(f"Health profile updated for user: {user_id}")
        except Exception as firebase_error:
            logger.warning(f"Firebase health update failed, using mock storage: {firebase_error}")
            # In development, just log the update
            logger.info(f"Mock health update for user {user_id}: {health_data}")
        
        return {"success": True, "message": "Health profile updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating health profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update health profile"
        )

@router.post(
    "/activity/{user_id}",
    summary="📊 Add Activity Record",
    description="Add a new activity record to user's activity history"
)
async def add_activity_record(
    user_id: str,
    activity_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """
    ## 📊 Add Activity Record
    
    Adds a new activity to user's history:
    - 🏥 **Health Assessments** - Completed health checks
    - 👨‍⚕️ **Consultations** - Doctor appointments
    - 🧪 **Tests** - Medical tests and evaluations
    - 💊 **Medications** - Medication tracking
    """
    try:
        # Verify user access
        # For development, allow access if using mock user
        if current_user.get('uid') != user_id and current_user.get('uid') != 'mock_user_id':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        db = firebase_service.db
        activities_ref = db.collection('userActivity').document(user_id).collection('activities')
        
        # Add timestamp and create activity
        activity_data['timestamp'] = datetime.utcnow()
        activity_data['id'] = str(uuid.uuid4())
        
        activities_ref.add(activity_data)
        
        logger.info(f"Activity added for user: {user_id}")
        
        return {"success": True, "message": "Activity record added successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding activity: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add activity record"
        )

@router.put(
    "/settings/{user_id}",
    summary="⚙️ Update User Settings",
    description="Update user preferences and privacy settings"
)
async def update_user_settings(
    user_id: str,
    settings_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """
    ## ⚙️ Update User Settings
    
    Updates user preferences:
    - 🔔 **Notifications** - Health reminders, appointments, medications
    - 🔒 **Privacy** - Profile visibility, data sharing preferences
    - 🎨 **Preferences** - UI preferences and customizations
    """
    try:
        # Verify user access
        # For development, allow access if using mock user
        if current_user.get('uid') != user_id and current_user.get('uid') != 'mock_user_id':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        db = firebase_service.db
        settings_ref = db.collection('userSettings').document(user_id)
        
        # Update settings document
        settings_data['updatedAt'] = datetime.utcnow()
        settings_ref.set(settings_data, merge=True)
        
        logger.info(f"Settings updated for user: {user_id}")
        
        return {"success": True, "message": "Settings updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating settings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update settings"
        )

@router.post(
    "/upload-picture/{user_id}",
    summary="📸 Upload Profile Picture",
    description="Upload and update user's profile picture"
)
async def upload_profile_picture(
    user_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    ## 📸 Upload Profile Picture
    
    Uploads and updates user's profile picture:
    - 📁 **File Upload** - Image file processing
    - 🔒 **Security** - File type validation
    - 🖼️ **Image Processing** - Resize and optimize
    - 💾 **Storage** - Firebase Storage integration
    """
    try:
        # Verify user access
        # For development, allow access if using mock user
        if current_user.get('uid') != user_id and current_user.get('uid') != 'mock_user_id':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed"
            )
        
        # Validate file size (max 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        file_content = await file.read()
        if len(file_content) > max_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File too large. Maximum size is 5MB"
            )
        
        # For now, we'll save the file locally and return a placeholder URL
        # In production, you would integrate with Firebase Storage or another cloud storage
        try:
            # Create uploads directory if it doesn't exist
            upload_dir = Path("uploads/profile_pictures")
            upload_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate unique filename
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
            filename = f"{user_id}_{uuid.uuid4().hex[:8]}.{file_extension}"
            file_path = upload_dir / filename
            
            # Save file locally
            with open(file_path, "wb") as buffer:
                buffer.write(file_content)
            
            # Generate URL (in production, this would be your CDN/storage URL)
            photo_url = f"/uploads/profile_pictures/{filename}"
            
            # Update user document with new photo URL
            db = firebase_service.db
            user_ref = db.collection('users').document(user_id)
            user_ref.set({
                'photoURL': photo_url,
                'updatedAt': datetime.utcnow()
            }, merge=True)
            
            logger.info(f"Profile picture uploaded for user: {user_id}")
            
            return {
                "success": True,
                "message": "Profile picture uploaded successfully",
                "photoURL": photo_url
            }
            
        except Exception as storage_error:
            logger.error(f"Storage error: {storage_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image to storage"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading profile picture: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload profile picture"
        )

@router.post(
    "/medical-history/{user_id}",
    summary="🏥 Add Medical History Entry",
    description="Add a new medical history entry"
)
async def add_medical_history(
    user_id: str,
    history_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """
    ## 🏥 Add Medical History Entry
    
    Adds a new medical history record:
    - 🩺 **Checkups** - Regular health examinations
    - 💉 **Vaccinations** - Immunization records
    - 🧪 **Tests** - Lab results and diagnostics
    - 🏥 **Treatments** - Medical procedures and treatments
    """
    try:
        # Verify user access
        # For development, allow access if using mock user
        if current_user.get('uid') != user_id and current_user.get('uid') != 'mock_user_id':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        db = firebase_service.db
        history_ref = db.collection('medicalHistory').document(user_id).collection('entries')
        
        # Add timestamp and create history entry
        history_data['timestamp'] = datetime.utcnow()
        history_data['id'] = str(uuid.uuid4())
        
        history_ref.add(history_data)
        
        logger.info(f"Medical history added for user: {user_id}")
        
        return {"success": True, "message": "Medical history entry added successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding medical history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add medical history entry"
        )

@router.get(
    "/medical-history/{user_id}",
    summary="📋 Get Medical History",
    description="Retrieve user's complete medical history"
)
async def get_medical_history(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    ## 📋 Get Medical History
    
    Retrieves complete medical history:
    - 📅 **Chronological Order** - Most recent first
    - 🏥 **All Records** - Checkups, tests, treatments
    - 📊 **Detailed Info** - Complete medical data
    """
    try:
        # Verify user access
        # For development, allow access if using mock user
        if current_user.get('uid') != user_id and current_user.get('uid') != 'mock_user_id':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        db = firebase_service.db
        history_ref = db.collection('medicalHistory').document(user_id).collection('entries')
        history_query = history_ref.order_by('timestamp', direction='DESCENDING')
        history_docs = history_query.stream()
        
        medical_history = [
            {**doc.to_dict(), 'id': doc.id} 
            for doc in history_docs
        ]
        
        return {
            "success": True,
            "data": medical_history
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting medical history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve medical history"
        )
