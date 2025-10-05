from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class AccidentSeverity(str, Enum):
    MINOR = "Minor"
    MODERATE = "Moderate"
    SEVERE = "Severe"

class Country(str, Enum):
    USA = "USA"
    UK = "UK"
    CANADA = "Canada"
    INDIA = "India"
    CHINA = "China"
    JAPAN = "Japan"

class Month(str, Enum):
    JANUARY = "January"
    FEBRUARY = "February"
    MARCH = "March"
    APRIL = "April"
    MAY = "May"
    JUNE = "June"
    JULY = "July"
    AUGUST = "August"
    SEPTEMBER = "September"
    OCTOBER = "October"
    NOVEMBER = "November"
    DECEMBER = "December"

class DayOfWeek(str, Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"

class TimeOfDay(str, Enum):
    MORNING = "Morning"
    AFTERNOON = "Afternoon"
    EVENING = "Evening"
    NIGHT = "Night"

class UrbanRural(str, Enum):
    URBAN = "Urban"
    RURAL = "Rural"

class RoadType(str, Enum):
    HIGHWAY = "Highway"
    MAIN_ROAD = "Main Road"
    STREET = "Street"

class WeatherConditions(str, Enum):
    CLEAR = "Clear"
    RAINY = "Rainy"
    SNOWY = "Snowy"
    FOGGY = "Foggy"
    WINDY = "Windy"

class DriverAgeGroup(str, Enum):
    YOUNG = "18-25"
    MIDDLE = "26-40"
    SENIOR = "41-60"
    ELDERLY = "60+"

class DriverGender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"

class VehicleCondition(str, Enum):
    GOOD = "Good"
    MODERATE = "Moderate"
    POOR = "Poor"

class RoadCondition(str, Enum):
    DRY = "Dry"
    WET = "Wet"
    ICY = "Icy"
    SNOW_COVERED = "Snow-covered"

class AccidentCause(str, Enum):
    SPEEDING = "Speeding"
    DISTRACTED_DRIVING = "Distracted Driving"
    WEATHER = "Weather"
    MECHANICAL_FAILURE = "Mechanical Failure"
    HUMAN_ERROR = "Human Error"

class AccidentPredictionRequest(BaseModel):
    """Request model for accident severity prediction"""
    
    # Location and time
    country: Country
    month: Month
    day_of_week: DayOfWeek
    time_of_day: TimeOfDay
    urban_rural: UrbanRural
    
    # Road conditions
    road_type: RoadType
    road_condition: RoadCondition
    speed_limit: int = Field(..., ge=0, le=200, description="Speed limit in km/h")
    
    # Weather
    weather_conditions: WeatherConditions
    visibility_level: float = Field(..., ge=0, le=1000, description="Visibility in meters")
    
    # Vehicle information
    number_of_vehicles_involved: int = Field(..., ge=1, le=20)
    vehicle_condition: VehicleCondition
    
    # Driver information
    driver_age_group: DriverAgeGroup
    driver_gender: DriverGender
    driver_alcohol_level: float = Field(..., ge=0.0, le=0.5, description="Blood alcohol level")
    driver_fatigue: int = Field(..., ge=0, le=1, description="Driver fatigue level (0-1)")
    
    # Other factors
    pedestrians_involved: int = Field(..., ge=0, le=20)
    cyclists_involved: int = Field(..., ge=0, le=20)
    traffic_volume: int = Field(..., ge=0, le=20000, description="Traffic volume per hour")
    population_density: int = Field(..., ge=0, le=10000, description="Population per sq km")
    accident_cause: AccidentCause
    
    @validator('driver_alcohol_level')
    def validate_alcohol_level(cls, v):
        if v < 0 or v > 0.5:
            raise ValueError('Alcohol level must be between 0.0 and 0.5')
        return v

class AccidentPredictionResponse(BaseModel):
    """Response model for accident severity prediction"""
    
    predicted_severity: AccidentSeverity
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    probabilities: Dict[str, float]
    risk_factors: List[str]
    recommendations: List[str]
    prediction_id: str
    timestamp: datetime
    model_version: str

class ModelPerformanceMetrics(BaseModel):
    """Model performance metrics"""
    
    accuracy: float
    precision: Dict[str, float]
    recall: Dict[str, float]
    f1_score: Dict[str, float]
    confusion_matrix: List[List[int]]
    feature_importance: Dict[str, float]
    model_version: str
    last_updated: datetime

class DataExplorationRequest(BaseModel):
    """Request for data exploration"""
    
    feature: str
    chart_type: str = Field(..., regex="^(histogram|bar|scatter|box|correlation)$")
    filters: Optional[Dict[str, Any]] = None

class DataExplorationResponse(BaseModel):
    """Response for data exploration"""
    
    chart_data: Dict[str, Any]
    statistics: Dict[str, Any]
    insights: List[str]

class HealthCheckResponse(BaseModel):
    """Health check response"""
    
    status: str
    ml_service: str
    version: str
    timestamp: datetime

class BatchPredictionRequest(BaseModel):
    """Batch prediction request"""
    
    predictions: List[AccidentPredictionRequest]
    
    @validator('predictions')
    def validate_batch_size(cls, v):
        if len(v) > 1000:
            raise ValueError('Batch size cannot exceed 1000 predictions')
        return v

class BatchPredictionResponse(BaseModel):
    """Batch prediction response"""
    
    predictions: List[AccidentPredictionResponse]
    batch_id: str
    total_predictions: int
    processing_time: float