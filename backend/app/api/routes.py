from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Dict, Any
import logging

from app.models.schemas import (
    AccidentPredictionRequest,
    AccidentPredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    ModelPerformanceMetrics,
    DataExplorationRequest,
    DataExplorationResponse,
    HealthCheckResponse
)
from app.services.ml_service import MLService
from app.services.data_service import DataService
from app.services.analytics_service import AnalyticsService

logger = logging.getLogger(__name__)

# Create router
api_router = APIRouter()

# Dependency to get ML service
async def get_ml_service() -> MLService:
    from app.main import ml_service
    return ml_service

# Dependency to get data service
async def get_data_service() -> DataService:
    return DataService()

# Dependency to get analytics service
async def get_analytics_service() -> AnalyticsService:
    return AnalyticsService()

@api_router.post("/predict", response_model=AccidentPredictionResponse)
async def predict_accident_severity(
    request: AccidentPredictionRequest,
    ml_service: MLService = Depends(get_ml_service)
):
    """Predict accident severity for a single case"""
    try:
        prediction = await ml_service.predict(request)
        logger.info(f"Prediction made: {prediction.predicted_severity}")
        return prediction
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(
    request: BatchPredictionRequest,
    background_tasks: BackgroundTasks,
    ml_service: MLService = Depends(get_ml_service)
):
    """Predict accident severity for multiple cases"""
    try:
        import time
        import uuid
        
        start_time = time.time()
        predictions = []
        
        for pred_request in request.predictions:
            prediction = await ml_service.predict(pred_request)
            predictions.append(prediction)
        
        processing_time = time.time() - start_time
        batch_id = str(uuid.uuid4())
        
        response = BatchPredictionResponse(
            predictions=predictions,
            batch_id=batch_id,
            total_predictions=len(predictions),
            processing_time=processing_time
        )
        
        # Log batch prediction in background
        background_tasks.add_task(
            log_batch_prediction, 
            batch_id, 
            len(predictions), 
            processing_time
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/model/performance", response_model=ModelPerformanceMetrics)
async def get_model_performance(
    ml_service: MLService = Depends(get_ml_service)
):
    """Get current model performance metrics"""
    try:
        metrics = await ml_service.get_performance_metrics()
        return metrics
    except Exception as e:
        logger.error(f"Error getting model performance: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/model/retrain")
async def retrain_model(
    background_tasks: BackgroundTasks,
    ml_service: MLService = Depends(get_ml_service)
):
    """Trigger model retraining"""
    try:
        # Add retraining task to background
        background_tasks.add_task(ml_service.train_model)
        
        return {
            "message": "Model retraining initiated",
            "status": "in_progress"
        }
    except Exception as e:
        logger.error(f"Error initiating model retraining: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/data/explore", response_model=DataExplorationResponse)
async def explore_data(
    request: DataExplorationRequest,
    data_service: DataService = Depends(get_data_service)
):
    """Explore dataset features and generate visualizations"""
    try:
        exploration_result = await data_service.explore_feature(
            request.feature,
            request.chart_type,
            request.filters
        )
        return exploration_result
    except Exception as e:
        logger.error(f"Data exploration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/data/summary")
async def get_data_summary(
    data_service: DataService = Depends(get_data_service)
):
    """Get dataset summary statistics"""
    try:
        summary = await data_service.get_summary_statistics()
        return summary
    except Exception as e:
        logger.error(f"Error getting data summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/trends")
async def get_accident_trends(
    period: str = "monthly",
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """Get accident trends analysis"""
    try:
        trends = await analytics_service.get_accident_trends(period)
        return trends
    except Exception as e:
        logger.error(f"Error getting trends: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/risk-factors")
async def get_risk_factor_analysis(
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """Get risk factor analysis"""
    try:
        risk_analysis = await analytics_service.analyze_risk_factors()
        return risk_analysis
    except Exception as e:
        logger.error(f"Error analyzing risk factors: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/geographical")
async def get_geographical_analysis(
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """Get geographical accident analysis"""
    try:
        geo_analysis = await analytics_service.get_geographical_analysis()
        return geo_analysis
    except Exception as e:
        logger.error(f"Error in geographical analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/health", response_model=HealthCheckResponse)
async def detailed_health_check(
    ml_service: MLService = Depends(get_ml_service)
):
    """Detailed health check of all services"""
    try:
        from datetime import datetime
        
        ml_status = await ml_service.health_check()
        
        return HealthCheckResponse(
            status="healthy" if ml_status == "healthy" else "unhealthy",
            ml_service=ml_status,
            version="2.0.0",
            timestamp=datetime.now()
        )
    except Exception as e:
        logger.error(f"Health check error: {e}")
        raise HTTPException(status_code=503, detail=str(e))

# Background task functions
async def log_batch_prediction(batch_id: str, count: int, processing_time: float):
    """Log batch prediction details"""
    logger.info(f"Batch prediction completed - ID: {batch_id}, Count: {count}, Time: {processing_time:.2f}s")