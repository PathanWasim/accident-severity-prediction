# Enhanced Accident Severity Prediction System

A comprehensive, production-ready accident severity prediction system built with modern technologies including FastAPI, React, XGBoost, and Docker.

## 🚀 Features

### Core Functionality
- **Advanced ML Prediction**: XGBoost-based accident severity prediction (Minor/Moderate/Severe)
- **Real-time Predictions**: WebSocket support for live predictions
- **Batch Processing**: Handle multiple predictions simultaneously
- **Model Monitoring**: Track model performance and drift

### Modern UI/UX
- **React + TypeScript**: Modern, responsive frontend
- **Chakra UI**: Beautiful, accessible component library
- **Real-time Updates**: Live data updates via WebSocket
- **Dark/Light Mode**: User preference support
- **Mobile Responsive**: Works on all devices

### Backend Excellence
- **FastAPI**: High-performance async API with automatic documentation
- **PostgreSQL**: Robust data storage
- **Redis**: Caching and session management
- **MLflow**: Model versioning and experiment tracking
- **Comprehensive Logging**: Structured logging with monitoring

### DevOps & Deployment
- **Docker Compose**: Complete containerized deployment
- **Nginx**: Reverse proxy and load balancing
- **Prometheus + Grafana**: Monitoring and alerting
- **CI/CD Ready**: GitHub Actions workflows
- **Health Checks**: Comprehensive system monitoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │────│   Nginx Proxy   │────│  FastAPI Backend │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   PostgreSQL    │─────────────┤
                       └─────────────────┘             │
                                                        │
                       ┌─────────────────┐             │
                       │     Redis       │─────────────┤
                       └─────────────────┘             │
                                                        │
                       ┌─────────────────┐             │
                       │    MLflow       │─────────────┘
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd accident-prediction-system
```

2. **Start the application**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs
- MLflow UI: http://localhost:5000
- Grafana Dashboard: http://localhost:3001 (admin/admin)

### Development Setup

1. **Backend Development**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

2. **Frontend Development**
```bash
cd frontend
npm install
npm start
```

## 📊 Key Improvements Over Original R Shiny App

### 1. **Modern Technology Stack**
- **Original**: R Shiny (single-threaded, limited scalability)
- **Enhanced**: FastAPI + React (async, highly scalable, modern)

### 2. **User Experience**
- **Original**: Basic Shiny UI with limited interactivity
- **Enhanced**: Modern React UI with real-time updates, responsive design

### 3. **Performance**
- **Original**: Synchronous processing, limited concurrent users
- **Enhanced**: Async processing, WebSocket support, caching, load balancing

### 4. **Deployment & Scalability**
- **Original**: Single R process, difficult to scale
- **Enhanced**: Containerized microservices, horizontal scaling, load balancing

### 5. **Monitoring & Observability**
- **Original**: Basic logging
- **Enhanced**: Comprehensive monitoring with Prometheus, Grafana, structured logging

### 6. **API & Integration**
- **Original**: Limited API capabilities
- **Enhanced**: RESTful API with OpenAPI docs, WebSocket support, batch processing

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/accident_prediction

# Redis
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs
WEATHER_API_KEY=your-weather-api-key
MAPS_API_KEY=your-maps-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📈 API Endpoints

### Prediction Endpoints
- `POST /api/v1/predict` - Single prediction
- `POST /api/v1/predict/batch` - Batch predictions
- `WebSocket /ws/predictions` - Real-time predictions

### Analytics Endpoints
- `GET /api/v1/analytics/trends` - Accident trends
- `GET /api/v1/analytics/risk-factors` - Risk factor analysis
- `GET /api/v1/analytics/geographical` - Geographical analysis

### Model Management
- `GET /api/v1/model/performance` - Model metrics
- `POST /api/v1/model/retrain` - Trigger retraining

### Data Exploration
- `POST /api/v1/data/explore` - Feature exploration
- `GET /api/v1/data/summary` - Dataset summary

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📦 Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Build and deploy**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment (AWS/GCP/Azure)
- Use provided Terraform configurations in `/deployment`
- Configure CI/CD pipelines with GitHub Actions
- Set up monitoring and alerting

## 🔒 Security Features

- JWT authentication and authorization
- Rate limiting and request validation
- CORS protection
- SQL injection prevention
- Input sanitization and validation
- HTTPS enforcement in production

## 📊 Monitoring & Observability

### Metrics Tracked
- API response times and error rates
- Model prediction accuracy and drift
- System resource usage
- User activity and engagement

### Alerts
- Model performance degradation
- System health issues
- High error rates
- Resource exhaustion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original R Shiny implementation for inspiration
- XGBoost team for the excellent ML library
- FastAPI and React communities for amazing frameworks
- Open source contributors and maintainers

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation at `/docs`
- Review API documentation at `/api/v1/docs`

---

**Built with ❤️ for safer roads and better predictions**