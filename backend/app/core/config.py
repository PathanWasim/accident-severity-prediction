from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings"""
    
    # Basic settings
    APP_NAME: str = "Accident Severity Prediction API"
    VERSION: str = "2.0.0"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: Optional[str] = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # ML Model settings
    MODEL_PATH: str = "models/"
    MODEL_VERSION: str = "latest"
    RETRAIN_THRESHOLD: float = 0.05  # Retrain if accuracy drops by 5%
    
    # File paths
    DATA_PATH: str = "data/"
    LOGS_PATH: str = "logs/"
    
    # External APIs
    WEATHER_API_KEY: Optional[str] = None
    MAPS_API_KEY: Optional[str] = None
    
    # Email settings
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # Monitoring
    ENABLE_METRICS: bool = True
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure directories exist
Path(settings.MODEL_PATH).mkdir(exist_ok=True)
Path(settings.DATA_PATH).mkdir(exist_ok=True)
Path(settings.LOGS_PATH).mkdir(exist_ok=True)