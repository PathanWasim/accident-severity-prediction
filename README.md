# 🚗 Accident Severity Prediction System

ML-powered system that predicts road accident severity (Minor/Moderate/Severe) using environmental and situational factors. FastAPI + React for better performance.

## ✨ Features

- 🌐 **Web Interface** - Clean, responsive UI for predictions
- 🔌 **REST API** - Programmatic access with auto-documentation  
- ⚡ **Real-time** - Instant predictions via WebSocket
- 📊 **Analytics** - Visualize trends and patterns
- 🔄 **Batch Processing** - Handle multiple predictions
- 📈 **Monitoring** - Track model performance

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | FastAPI (Python) |
| Frontend | React + TypeScript |
| ML Model | XGBoost |
| Database | PostgreSQL |
| Cache | Redis |
| Deploy | Docker Compose |

## 🚀 Quick Start

**Prerequisites:** Docker, Docker Compose, Git

```bash
# 1. Clone & setup
git clone <repository-url>
cd accident-prediction-system

# 2. Add dataset (road_accident_dataset.csv to project root)

# 3. Deploy
./deploy.sh    # Linux/Mac
deploy.bat     # Windows
```

**Access Points:**
- 🌐 Web App: http://localhost:3000
- 📚 API Docs: http://localhost:8000/docs  
- 🔬 MLflow: http://localhost:5000
- 📊 Grafana: http://localhost:3001

## 📝 Usage

**Input Parameters:**
- 📍 Location & Time (country, month, day, time)
- 🛣️ Road Conditions (type, surface, speed limit)
- 🌤️ Weather (conditions, visibility)
- 🚙 Vehicle Info (count, condition)
- 👤 Driver Info (age, gender, alcohol, fatigue)
- 🚶 Other Factors (pedestrians, cyclists, traffic)

**API Examples:**
```bash
# Single prediction
curl -X POST "localhost:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{"country": "USA", "weather_conditions": "Clear", ...}'

# Batch predictions  
curl -X POST "localhost:8000/api/v1/predict/batch" \
  -d '{"predictions": [...]}'
```

## 🔧 Development

**Backend:**
```bash
cd backend && python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate  
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend && npm install && npm start
```

**Environment:** Create `backend/.env`
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/accident_prediction
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
```

## 🤖 Model Info

- **Algorithm:** XGBoost Classifier
- **Accuracy:** 85-90% on test data
- **Classes:** Minor, Moderate, Severe  
- **Features:** 20+ parameters
- **Training:** Automated retraining available

## 🚢 Deployment

```bash
# Local
docker-compose up -d

# Production  
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork → Create branch → Make changes → Test → PR

## 📄 License

MIT License

## 💬 Support

- 📖 API Docs: `/docs`
- 📋 Logs: `backend/logs/`  
- ❤️ Health: `/health`
