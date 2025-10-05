import joblib
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
import logging
from pathlib import Path
import asyncio
from datetime import datetime
import uuid

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import xgboost as xgb

from app.core.config import settings
from app.models.schemas import (
    AccidentPredictionRequest, 
    AccidentPredictionResponse, 
    AccidentSeverity,
    ModelPerformanceMetrics
)

logger = logging.getLogger(__name__)

class MLService:
    """Enhanced ML service for accident severity prediction"""
    
    def __init__(self):
        self.model = None
        self.feature_encoders = {}
        self.feature_columns = []
        self.model_version = "1.0.0"
        self.last_training_time = None
        self.performance_metrics = None
        
    async def initialize(self):
        """Initialize the ML service"""
        try:
            await self.load_model()
            await self.load_data()
            logger.info("ML Service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize ML service: {e}")
            raise
    
    async def load_model(self):
        """Load the trained model and encoders"""
        model_path = Path(settings.MODEL_PATH) / "accident_model.joblib"
        encoders_path = Path(settings.MODEL_PATH) / "encoders.joblib"
        
        if model_path.exists() and encoders_path.exists():
            self.model = joblib.load(model_path)
            self.feature_encoders = joblib.load(encoders_path)
            logger.info("Loaded existing model and encoders")
        else:
            logger.info("No existing model found, will train new model")
            await self.train_model()
    
    async def load_data(self):
        """Load and preprocess the dataset"""
        try:
            data_path = Path("road_accident_dataset.csv")
            if data_path.exists():
                self.data = pd.read_csv(data_path)
                logger.info(f"Loaded dataset with {len(self.data)} records")
            else:
                logger.warning("Dataset not found, using sample data")
                self.data = self._create_sample_data()
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            self.data = self._create_sample_data()
    
    def _create_sample_data(self) -> pd.DataFrame:
        """Create sample data for testing"""
        # This would be replaced with actual data loading logic
        return pd.DataFrame({
            'Country': ['USA', 'UK', 'Canada'] * 100,
            'Accident.Severity': ['Minor', 'Moderate', 'Severe'] * 100
        })
    
    async def train_model(self):
        """Train the XGBoost model"""
        try:
            logger.info("Starting model training...")
            
            # Prepare features and target
            X, y = self._prepare_training_data()
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Train XGBoost model
            self.model = xgb.XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                eval_metric='mlogloss'
            )
            
            self.model.fit(X_train, y_train)
            
            # Evaluate model
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            logger.info(f"Model trained with accuracy: {accuracy:.4f}")
            
            # Save model and encoders
            await self._save_model()
            
            # Update performance metrics
            self.performance_metrics = self._calculate_metrics(y_test, y_pred)
            self.last_training_time = datetime.now()
            
        except Exception as e:
            logger.error(f"Error training model: {e}")
            raise
    
    def _prepare_training_data(self):
        """Prepare data for training"""
        # Clean column names
        self.data.columns = self.data.columns.str.replace(' ', '.').str.replace('/', '.')
        
        # Define categorical and numerical columns
        categorical_cols = [
            'Country', 'Month', 'Day.of.Week', 'Time.of.Day', 'Urban.Rural',
            'Road.Type', 'Weather.Conditions', 'Driver.Age.Group', 'Driver.Gender',
            'Vehicle.Condition', 'Road.Condition', 'Accident.Cause'
        ]
        
        numerical_cols = [
            'Visibility.Level', 'Number.of.Vehicles.Involved', 'Speed.Limit',
            'Driver.Alcohol.Level', 'Driver.Fatigue', 'Pedestrians.Involved',
            'Cyclists.Involved', 'Traffic.Volume', 'Population.Density'
        ]
        
        # Prepare features
        X = pd.DataFrame()
        
        # Encode categorical features
        for col in categorical_cols:
            if col in self.data.columns:
                if col not in self.feature_encoders:
                    self.feature_encoders[col] = LabelEncoder()
                    X[col] = self.feature_encoders[col].fit_transform(self.data[col].astype(str))
                else:
                    X[col] = self.feature_encoders[col].transform(self.data[col].astype(str))
        
        # Add numerical features
        for col in numerical_cols:
            if col in self.data.columns:
                X[col] = pd.to_numeric(self.data[col], errors='coerce').fillna(0)
        
        # Prepare target
        if 'Accident.Severity' not in self.feature_encoders:
            self.feature_encoders['Accident.Severity'] = LabelEncoder()
            y = self.feature_encoders['Accident.Severity'].fit_transform(self.data['Accident.Severity'])
        else:
            y = self.feature_encoders['Accident.Severity'].transform(self.data['Accident.Severity'])
        
        self.feature_columns = X.columns.tolist()
        return X, y
    
    async def _save_model(self):
        """Save the trained model and encoders"""
        model_path = Path(settings.MODEL_PATH) / "accident_model.joblib"
        encoders_path = Path(settings.MODEL_PATH) / "encoders.joblib"
        
        joblib.dump(self.model, model_path)
        joblib.dump(self.feature_encoders, encoders_path)
        
        logger.info("Model and encoders saved successfully")
    
    def _calculate_metrics(self, y_true, y_pred) -> ModelPerformanceMetrics:
        """Calculate model performance metrics"""
        accuracy = accuracy_score(y_true, y_pred)
        report = classification_report(y_true, y_pred, output_dict=True)
        cm = confusion_matrix(y_true, y_pred)
        
        # Get feature importance
        feature_importance = {}
        if hasattr(self.model, 'feature_importances_'):
            for i, importance in enumerate(self.model.feature_importances_):
                if i < len(self.feature_columns):
                    feature_importance[self.feature_columns[i]] = float(importance)
        
        return ModelPerformanceMetrics(
            accuracy=accuracy,
            precision={k: v['precision'] for k, v in report.items() if k.isdigit()},
            recall={k: v['recall'] for k, v in report.items() if k.isdigit()},
            f1_score={k: v['f1-score'] for k, v in report.items() if k.isdigit()},
            confusion_matrix=cm.tolist(),
            feature_importance=feature_importance,
            model_version=self.model_version,
            last_updated=datetime.now()
        )
    
    async def predict(self, request: AccidentPredictionRequest) -> AccidentPredictionResponse:
        """Make a prediction for accident severity"""
        try:
            # Convert request to feature vector
            features = self._request_to_features(request)
            
            # Make prediction
            prediction_proba = self.model.predict_proba([features])[0]
            prediction_class = self.model.predict([features])[0]
            
            # Convert back to severity labels
            severity_labels = self.feature_encoders['Accident.Severity'].classes_
            predicted_severity = severity_labels[prediction_class]
            
            # Create probability dictionary
            probabilities = {
                severity_labels[i]: float(prob) 
                for i, prob in enumerate(prediction_proba)
            }
            
            # Calculate confidence score
            confidence_score = float(max(prediction_proba))
            
            # Generate risk factors and recommendations
            risk_factors = self._identify_risk_factors(request, features)
            recommendations = self._generate_recommendations(predicted_severity, risk_factors)
            
            return AccidentPredictionResponse(
                predicted_severity=AccidentSeverity(predicted_severity),
                confidence_score=confidence_score,
                probabilities=probabilities,
                risk_factors=risk_factors,
                recommendations=recommendations,
                prediction_id=str(uuid.uuid4()),
                timestamp=datetime.now(),
                model_version=self.model_version
            )
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise
    
    def _request_to_features(self, request: AccidentPredictionRequest) -> List[float]:
        """Convert prediction request to feature vector"""
        features = []
        
        # Categorical features
        categorical_mapping = {
            'Country': request.country.value,
            'Month': request.month.value,
            'Day.of.Week': request.day_of_week.value,
            'Time.of.Day': request.time_of_day.value,
            'Urban.Rural': request.urban_rural.value,
            'Road.Type': request.road_type.value,
            'Weather.Conditions': request.weather_conditions.value,
            'Driver.Age.Group': request.driver_age_group.value,
            'Driver.Gender': request.driver_gender.value,
            'Vehicle.Condition': request.vehicle_condition.value,
            'Road.Condition': request.road_condition.value,
            'Accident.Cause': request.accident_cause.value
        }
        
        # Encode categorical features
        for col in self.feature_columns:
            if col in categorical_mapping:
                if col in self.feature_encoders:
                    try:
                        encoded_value = self.feature_encoders[col].transform([categorical_mapping[col]])[0]
                        features.append(float(encoded_value))
                    except ValueError:
                        # Handle unseen categories
                        features.append(0.0)
                else:
                    features.append(0.0)
            else:
                # Numerical features
                numerical_mapping = {
                    'Visibility.Level': request.visibility_level,
                    'Number.of.Vehicles.Involved': request.number_of_vehicles_involved,
                    'Speed.Limit': request.speed_limit,
                    'Driver.Alcohol.Level': request.driver_alcohol_level,
                    'Driver.Fatigue': request.driver_fatigue,
                    'Pedestrians.Involved': request.pedestrians_involved,
                    'Cyclists.Involved': request.cyclists_involved,
                    'Traffic.Volume': request.traffic_volume,
                    'Population.Density': request.population_density
                }
                
                if col in numerical_mapping:
                    features.append(float(numerical_mapping[col]))
                else:
                    features.append(0.0)
        
        return features
    
    def _identify_risk_factors(self, request: AccidentPredictionRequest, features: List[float]) -> List[str]:
        """Identify risk factors based on input parameters"""
        risk_factors = []
        
        # High-risk conditions
        if request.driver_alcohol_level > 0.08:
            risk_factors.append("High alcohol level detected")
        
        if request.driver_fatigue == 1:
            risk_factors.append("Driver fatigue present")
        
        if request.weather_conditions.value in ["Rainy", "Snowy", "Foggy"]:
            risk_factors.append("Adverse weather conditions")
        
        if request.visibility_level < 100:
            risk_factors.append("Poor visibility")
        
        if request.speed_limit > 80:
            risk_factors.append("High speed limit area")
        
        if request.road_condition.value in ["Wet", "Icy", "Snow-covered"]:
            risk_factors.append("Poor road conditions")
        
        if request.time_of_day.value in ["Evening", "Night"]:
            risk_factors.append("Low light conditions")
        
        return risk_factors
    
    def _generate_recommendations(self, predicted_severity: str, risk_factors: List[str]) -> List[str]:
        """Generate safety recommendations"""
        recommendations = []
        
        if predicted_severity == "Severe":
            recommendations.append("Exercise extreme caution - high risk conditions detected")
        elif predicted_severity == "Moderate":
            recommendations.append("Increased vigilance recommended")
        
        if "High alcohol level detected" in risk_factors:
            recommendations.append("Do not drive - alcohol level exceeds safe limits")
        
        if "Driver fatigue present" in risk_factors:
            recommendations.append("Take a break before driving")
        
        if "Adverse weather conditions" in risk_factors:
            recommendations.append("Reduce speed and increase following distance")
        
        if "Poor visibility" in risk_factors:
            recommendations.append("Use headlights and drive slowly")
        
        if "Poor road conditions" in risk_factors:
            recommendations.append("Drive carefully and avoid sudden maneuvers")
        
        return recommendations
    
    async def get_performance_metrics(self) -> ModelPerformanceMetrics:
        """Get current model performance metrics"""
        if self.performance_metrics is None:
            # Calculate metrics if not available
            if self.model is not None and hasattr(self, 'data'):
                X, y = self._prepare_training_data()
                y_pred = self.model.predict(X)
                self.performance_metrics = self._calculate_metrics(y, y_pred)
        
        return self.performance_metrics
    
    async def health_check(self) -> str:
        """Check ML service health"""
        if self.model is None:
            return "unhealthy - model not loaded"
        
        try:
            # Test prediction with dummy data
            dummy_request = AccidentPredictionRequest(
                country="USA",
                month="January",
                day_of_week="Monday",
                time_of_day="Morning",
                urban_rural="Urban",
                road_type="Street",
                road_condition="Dry",
                speed_limit=50,
                weather_conditions="Clear",
                visibility_level=500,
                number_of_vehicles_involved=2,
                vehicle_condition="Good",
                driver_age_group="26-40",
                driver_gender="Male",
                driver_alcohol_level=0.0,
                driver_fatigue=0,
                pedestrians_involved=0,
                cyclists_involved=0,
                traffic_volume=1000,
                population_density=2000,
                accident_cause="Human Error"
            )
            
            await self.predict(dummy_request)
            return "healthy"
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return f"unhealthy - {str(e)}"
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("ML Service cleanup completed")