"""
Health profile routes - matches Node.js healthRoutes.js exactly
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.models.health_profile import HealthProfileCreate, HealthProfileUpdate
from app.database import get_database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["👤 Health Profile Management"])

@router.post("/update-health")
async def update_health_profile(profile_data: HealthProfileCreate, db=Depends(get_database)):
    """
    Save or update health profile - matches Node.js /update-health route exactly
    """
    try:
        if not profile_data.userId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="userId is required"
            )
        
        # Check if profile exists
        existing_profile = await db.health_profiles.find_one({"userId": profile_data.userId})
        
        # Convert profile data to dict
        profile_dict = profile_data.dict(exclude_unset=True)
        
        if existing_profile:
            # Update existing profile
            await db.health_profiles.update_one(
                {"userId": profile_data.userId},
                {"$set": profile_dict}
            )
            logger.info(f"✅ Health profile updated for user: {profile_data.userId}")
        else:
            # Create new profile
            await db.health_profiles.insert_one(profile_dict)
            logger.info(f"✅ Health profile created for user: {profile_data.userId}")
        
        return {"message": "Profile saved successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error saving profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save profile"
        )

@router.get("/user-health")
async def get_user_health(userId: str = Query(..., description="User ID"), db=Depends(get_database)):
    """
    Load health profile by userId - matches Node.js /user-health route exactly
    """
    try:
        if not userId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="userId is required"
            )
        
        # Find health profile
        profile = await db.health_profiles.find_one({"userId": userId})
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Convert ObjectId to string
        if "_id" in profile:
            profile["_id"] = str(profile["_id"])
        
        logger.info(f"✅ Health profile loaded for user: {userId}")
        
        return profile
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error loading profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load profile"
        )
