# Accident Severity Prediction System

A machine learning system that predicts the severity of road accidents using various environmental and situational factors. Originally built with R Shiny, now modernized with FastAPI and React for better performance and scalability.

## Overview

This system analyzes multiple factors including weather conditions, road type, driver characteristics, and vehicle information to predict whether an accident will be Minor, Moderate, or Severe. The prediction model uses XGBoost algorithm trained on historical accident data.

## Features

- **Web Interface**: Clean, responsive interface for making predictions
- **REST API**: Programmatic access for integration with other systems
- **Real-time Predictions**: Instant results via WebSocket connections
- **Batch Processing**: Handle multiple predictions at once
- **Analytics Dashboard**: Visualize trends and patterns in accident data
- **Model Monitoring**: Track prediction accuracy and model performance

## Technology Stack

- **Backend**: FastAPI (Python) with async support
- **Frontend**: React with TypeScript
- **Machine Learning**: XGBoost for classification
- **Database**: PostgreSQL for data storage
- **Caching**: Redis for improved performance
- **Deployment**: Docker containers with docker-compose
- **Monitoring**: Prometheus and Grafana

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd accident-prediction-system
```

2. Add your dataset:
   - Place `road_accident_dataset.csv` in the project root
   - The system will automatically load and process the data

3. Start the application:
```bash
# Windows
deploy.bat

# Linux/Mac
./deploy.sh
```

4. Access the application:
   - Web Interface: http://localhost:3000
   - API Documentation: http://localhost:8000/docs
   - MLflow Tracking: http://localhost:5000
   - Monitoring Dashboard: http://localhost:3001

## Usage

### Making Predictions

The system requires the following input parameters:

- **Location & Time**: Country, month, day of week, time of day
- **Road Conditions**: Urban/rural, road type, surface condition, speed limit
- **Weather**: Conditions, visibility level
- **Vehicle Info**: Number of vehicles, vehicle condition
- **Driver Info**: Age group, gender, alcohol level, fatigue status
- **Other Factors**: Pedestrians/cyclists involved, traffic volume, population density

### API Usage

```bash
# Single prediction
curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "country": "USA",
    "weather_conditions": "Clear",
    "road_type": "Highway",
    "speed_limit": 65,
    ...
  }'

# Batch predictions
curl -X POST "http://localhost:8000/api/v1/predict/batch" \
  -H "Content-Type: application/json" \
  -d '{"predictions": [...]}'
```

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### Environment Configuration

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/accident_prediction
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
DEBUG=false
```

## Model Information

The prediction model uses XGBoost classifier trained on historical accident data. Key features include:

- **Accuracy**: Typically 85-90% on test data
- **Classes**: Minor, Moderate, Severe
- **Features**: 20+ input parameters
- **Training**: Automated retraining when new data is available

## Deployment

### Local Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

The system includes health checks, logging, and monitoring for production use.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- Check the API documentation at `/docs`
- Review logs in `backend/logs/`
- Monitor system health at `/health`