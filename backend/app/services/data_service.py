import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
import logging
from pathlib import Path

from app.core.config import settings
from app.models.schemas import DataExplorationResponse

logger = logging.getLogger(__name__)

class DataService:
    """Service for data exploration and analysis"""
    
    def __init__(self):
        self.data = None
        self._load_data()
    
    def _load_data(self):
        """Load the dataset"""
        try:
            data_path = Path("road_accident_dataset.csv")
            if data_path.exists():
                self.data = pd.read_csv(data_path)
                logger.info(f"Loaded dataset with {len(self.data)} records")
            else:
                logger.warning("Dataset not found")
                self.data = self._create_sample_data()
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            self.data = self._create_sample_data()
    
    def _create_sample_data(self) -> pd.DataFrame:
        """Create sample data for testing"""
        return pd.DataFrame({
            'Country': ['USA', 'UK', 'Canada'] * 100,
            'Accident.Severity': ['Minor', 'Moderate', 'Severe'] * 100,
            'Speed.Limit': np.random.randint(30, 120, 300),
            'Visibility.Level': np.random.uniform(50, 500, 300)
        })
    
    async def explore_feature(
        self, 
        feature: str, 
        chart_type: str, 
        filters: Optional[Dict[str, Any]] = None
    ) -> DataExplorationResponse:
        """Explore a specific feature"""
        try:
            if self.data is None:
                raise ValueError("No data available")
            
            # Apply filters if provided
            filtered_data = self.data.copy()
            if filters:
                for key, value in filters.items():
                    if key in filtered_data.columns:
                        filtered_data = filtered_data[filtered_data[key] == value]
            
            # Generate chart data based on type
            chart_data = self._generate_chart_data(filtered_data, feature, chart_type)
            
            # Calculate statistics
            statistics = self._calculate_statistics(filtered_data, feature)
            
            # Generate insights
            insights = self._generate_insights(filtered_data, feature)
            
            return DataExplorationResponse(
                chart_data=chart_data,
                statistics=statistics,
                insights=insights
            )
            
        except Exception as e:
            logger.error(f"Error exploring feature {feature}: {e}")
            raise
    
    def _generate_chart_data(self, data: pd.DataFrame, feature: str, chart_type: str) -> Dict[str, Any]:
        """Generate chart data based on chart type"""
        if feature not in data.columns:
            return {"error": f"Feature {feature} not found"}
        
        if chart_type == "histogram":
            if data[feature].dtype in ['int64', 'float64']:
                hist, bins = np.histogram(data[feature].dropna(), bins=20)
                return {
                    "type": "histogram",
                    "bins": bins.tolist(),
                    "counts": hist.tolist()
                }
        
        elif chart_type == "bar":
            if data[feature].dtype == 'object':
                value_counts = data[feature].value_counts()
                return {
                    "type": "bar",
                    "labels": value_counts.index.tolist(),
                    "values": value_counts.values.tolist()
                }
        
        return {"type": chart_type, "message": "Chart data generation not implemented"}
    
    def _calculate_statistics(self, data: pd.DataFrame, feature: str) -> Dict[str, Any]:
        """Calculate basic statistics for a feature"""
        if feature not in data.columns:
            return {"error": f"Feature {feature} not found"}
        
        series = data[feature].dropna()
        
        if series.dtype in ['int64', 'float64']:
            return {
                "count": len(series),
                "mean": float(series.mean()),
                "median": float(series.median()),
                "std": float(series.std()),
                "min": float(series.min()),
                "max": float(series.max()),
                "missing": data[feature].isna().sum()
            }
        else:
            return {
                "count": len(series),
                "unique": series.nunique(),
                "top": series.mode().iloc[0] if len(series.mode()) > 0 else None,
                "freq": series.value_counts().iloc[0] if len(series) > 0 else 0,
                "missing": data[feature].isna().sum()
            }
    
    def _generate_insights(self, data: pd.DataFrame, feature: str) -> List[str]:
        """Generate insights about the feature"""
        insights = []
        
        if feature not in data.columns:
            return ["Feature not found in dataset"]
        
        series = data[feature].dropna()
        
        # Missing data insight
        missing_pct = (data[feature].isna().sum() / len(data)) * 100
        if missing_pct > 5:
            insights.append(f"High missing data: {missing_pct:.1f}% of values are missing")
        
        # Data type specific insights
        if series.dtype in ['int64', 'float64']:
            # Numerical insights
            if series.std() / series.mean() > 1:
                insights.append("High variability detected in the data")
            
            # Outlier detection (simple IQR method)
            Q1 = series.quantile(0.25)
            Q3 = series.quantile(0.75)
            IQR = Q3 - Q1
            outliers = series[(series < Q1 - 1.5 * IQR) | (series > Q3 + 1.5 * IQR)]
            if len(outliers) > 0:
                insights.append(f"Potential outliers detected: {len(outliers)} values")
        
        else:
            # Categorical insights
            if series.nunique() / len(series) > 0.8:
                insights.append("High cardinality: Many unique values detected")
            
            # Check for imbalanced categories
            value_counts = series.value_counts()
            if len(value_counts) > 1:
                ratio = value_counts.iloc[0] / value_counts.iloc[-1]
                if ratio > 10:
                    insights.append("Imbalanced categories: Some categories are much more frequent")
        
        return insights if insights else ["No significant patterns detected"]
    
    async def get_summary_statistics(self) -> Dict[str, Any]:
        """Get overall dataset summary statistics"""
        try:
            if self.data is None:
                return {"error": "No data available"}
            
            summary = {
                "total_records": len(self.data),
                "feature_count": len(self.data.columns),
                "missing_data": self.data.isna().sum().to_dict(),
                "data_types": self.data.dtypes.astype(str).to_dict(),
            }
            
            # Add severity distribution if available
            if 'Accident.Severity' in self.data.columns:
                summary["severity_distribution"] = self.data['Accident.Severity'].value_counts().to_dict()
            
            return summary
            
        except Exception as e:
            logger.error(f"Error getting summary statistics: {e}")
            raise