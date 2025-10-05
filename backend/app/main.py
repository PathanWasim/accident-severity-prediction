from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
import uvicorn
import logging
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.routes import api_router
from app.services.ml_service import MLService
from app.services.websocket_manager import WebSocketManager

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Global instances
ml_service = MLService()
websocket_manager = WebSocketManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Accident Prediction API...")
    await ml_service.initialize()
    logger.info("ML Service initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Accident Prediction API...")
    await ml_service.cleanup()

# Create FastAPI app
app = FastAPI(
    title="Accident Severity Prediction API",
    description="Advanced ML-powered accident severity prediction system",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Security
security = HTTPBearer()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Accident Severity Prediction API",
        "version": "2.0.0",
        "status": "active",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        model_status = await ml_service.health_check()
        return {
            "status": "healthy",
            "ml_service": model_status,
            "version": "2.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.websocket("/ws/predictions")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time predictions"""
    await websocket_manager.connect(websocket)
    try:
        while True:
            # Wait for prediction requests
            data = await websocket.receive_json()
            
            # Process prediction
            try:
                prediction = await ml_service.predict(data)
                await websocket_manager.send_personal_message(
                    {"type": "prediction", "data": prediction}, 
                    websocket
                )
            except Exception as e:
                await websocket_manager.send_personal_message(
                    {"type": "error", "message": str(e)}, 
                    websocket
                )
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )