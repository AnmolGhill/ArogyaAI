"""
Database connection and configuration for MongoDB
"""
import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

# Database instance
db = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        db.client = AsyncIOMotorClient(settings.MONGO_URI)
        db.database = db.client[settings.DATABASE_NAME]
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info("✅ MongoDB connected successfully")
        
    except Exception as e:
        logger.error(f"❌ MongoDB connection error: {e}")
        raise e

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("🔌 MongoDB connection closed")

def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db.database
