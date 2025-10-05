import pandas as pd
import numpy as np
from typing import Dict, List, Any
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class AnalyticsService:
    """Service for advanced analytics and insights"""
    
    def __init__(self):
        self.data = None
        self._load_data()
    
    def _load_data(self):
        """Load the dataset"""
        try:
            data_path = Path("road_accident_dataset.csv")
            if data_path.exists():
                self.data = pd.read_csv(data_path)
                logger.info(f"Loaded dataset for analytics with {len(self.data)} records")
            else:
                logger.warning("Dataset not found for analytics")
                self.data = self._create_sample_data()
        except Exception as e:
            logger.error(f"Error loading data for analytics: {e}")
            self.data = self._create_sample_data()
    
    def _create_sample_data(self) -> pd.DataFrame:
        """Create sample data for testing"""
        np.random.seed(42)
        dates = pd.date_range('2023-01-01', '2023-12-31', freq='D')
        
        return pd.DataFrame({
            'Date': np.random.choice(dates, 1000),
            'Country': np.random.choice(['USA', 'UK', 'Canada', 'India'], 1000),
            'Month': np.random.choice(['January', 'February', 'March', 'April'], 1000),
            'Accident.Severity': np.random.choice(['Minor', 'Moderate', 'Severe'], 1000, p=[0.5, 0.3, 0.2]),
            'Weather.Conditions': np.random.choice(['Clear', 'Rainy', 'Snowy', 'Foggy'], 1000),
            'Speed.Limit': np.random.randint(30, 120, 1000),
            'Driver.Age.Group': np.random.choice(['18-25', '26-40', '41-60', '60+'], 1000)
        })
    
    async def get_accident_trends(self, period: str = "monthly") -> Dict[str, Any]:
        """Get accident trends over time"""
        try:
            if self.data is None:
                return {"error": "No data available"}
            
            # Group by period
            if period == "monthly" and 'Month' in self.data.columns:
                grouped = self.data.groupby(['Month', 'Accident.Severity']).size().unstack(fill_value=0)
            else:
                # Default grouping
                grouped = self.data.groupby('Accident.Severity').size()
                return {
                    "period": "overall",
                    "data": grouped.to_dict()
                }
            
            # Convert to format suitable for frontend
            trends_data = []
            for month in grouped.index:
                trends_data.append({
                    "period": month,
                    "minor": int(grouped.loc[month].get('Minor', 0)),
                    "moderate": int(grouped.loc[month].get('Moderate', 0)),
                    "severe": int(grouped.loc[month].get('Severe', 0)),
                    "total": int(grouped.loc[month].sum())
                })
            
            return {
                "period": period,
                "data": trends_data,
                "summary": {
                    "total_accidents": len(self.data),
                    "avg_per_period": len(self.data) / len(trends_data) if trends_data else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting accident trends: {e}")
            return {"error": str(e)}
    
    async def analyze_risk_factors(self) -> Dict[str, Any]:
        """Analyze key risk factors"""
        try:
            if self.data is None:
                return {"error": "No data available"}
            
            risk_factors = []
            
            # Analyze weather conditions
            if 'Weather.Conditions' in self.data.columns and 'Accident.Severity' in self.data.columns:
                weather_severity = pd.crosstab(
                    self.data['Weather.Conditions'], 
                    self.data['Accident.Severity'], 
                    normalize='index'
                )
                
                for weather in weather_severity.index:
                    severe_rate = weather_severity.loc[weather].get('Severe', 0)
                    risk_factors.append({
                        "factor": f"Weather: {weather}",
                        "severe_rate": float(severe_rate),
                        "impact_score": float(severe_rate * 100),
                        "frequency": int(self.data[self.data['Weather.Conditions'] == weather].shape[0])
                    })
            
            # Analyze speed limits
            if 'Speed.Limit' in self.data.columns:
                high_speed = self.data[self.data['Speed.Limit'] > 80]
                if len(high_speed) > 0:
                    severe_rate = (high_speed['Accident.Severity'] == 'Severe').mean()
                    risk_factors.append({
                        "factor": "High Speed Limit (>80 km/h)",
                        "severe_rate": float(severe_rate),
                        "impact_score": float(severe_rate * 100),
                        "frequency": len(high_speed)
                    })
            
            # Sort by impact score
            risk_factors.sort(key=lambda x: x['impact_score'], reverse=True)
            
            return {
                "risk_factors": risk_factors[:10],  # Top 10
                "total_analyzed": len(self.data),
                "methodology": "Cross-tabulation analysis of categorical factors vs severity"
            }
            
        except Exception as e:
            logger.error(f"Error analyzing risk factors: {e}")
            return {"error": str(e)}
    
    async def get_geographical_analysis(self) -> Dict[str, Any]:
        """Get geographical analysis of accidents"""
        try:
            if self.data is None:
                return {"error": "No data available"}
            
            geographical_data = []
            
            if 'Country' in self.data.columns and 'Accident.Severity' in self.data.columns:
                country_stats = self.data.groupby('Country').agg({
                    'Accident.Severity': ['count', lambda x: (x == 'Severe').sum()]
                }).round(2)
                
                country_stats.columns = ['total_accidents', 'severe_accidents']
                
                for country in country_stats.index:
                    total = int(country_stats.loc[country, 'total_accidents'])
                    severe = int(country_stats.loc[country, 'severe_accidents'])
                    
                    geographical_data.append({
                        "country": country,
                        "total_accidents": total,
                        "severe_accidents": severe,
                        "severe_rate": float(severe / total) if total > 0 else 0,
                        "severity_distribution": {
                            "Minor": int(self.data[(self.data['Country'] == country) & 
                                                 (self.data['Accident.Severity'] == 'Minor')].shape[0]),
                            "Moderate": int(self.data[(self.data['Country'] == country) & 
                                                    (self.data['Accident.Severity'] == 'Moderate')].shape[0]),
                            "Severe": severe
                        }
                    })
            
            return {
                "geographical_data": geographical_data,
                "summary": {
                    "countries_analyzed": len(geographical_data),
                    "total_accidents": len(self.data)
                }
            }
            
        except Exception as e:
            logger.error(f"Error in geographical analysis: {e}")
            return {"error": str(e)}