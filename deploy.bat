@echo off
REM Enhanced Accident Prediction System Deployment Script for Windows
REM This script handles the complete deployment of the application

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

set COMPOSE_FILE=docker-compose.yml
if "%ENVIRONMENT%"=="production" set COMPOSE_FILE=docker-compose.prod.yml

echo.
echo 🚀 Starting deployment for %ENVIRONMENT% environment
echo.

REM Check prerequisites
echo 🔍 Checking prerequisites...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup environment
echo.
echo 🔧 Setting up environment...

REM Create necessary directories
if not exist "backend\data" mkdir backend\data
if not exist "backend\models" mkdir backend\models
if not exist "backend\logs" mkdir backend\logs
if not exist "ml-pipeline\experiments" mkdir ml-pipeline\experiments

REM Copy dataset if it exists
if exist "road_accident_dataset.csv" (
    copy road_accident_dataset.csv backend\data\ >nul
    echo ✅ Dataset copied to backend/data/
) else (
    echo ⚠️  Dataset not found. Please ensure road_accident_dataset.csv is available.
)

REM Create .env file if it doesn't exist
if not exist "backend\.env" (
    echo # Database > backend\.env
    echo DATABASE_URL=postgresql://postgres:password@db:5432/accident_prediction >> backend\.env
    echo. >> backend\.env
    echo # Redis >> backend\.env
    echo REDIS_URL=redis://redis:6379 >> backend\.env
    echo. >> backend\.env
    echo # Security >> backend\.env
    echo SECRET_KEY=your-secret-key-change-in-production >> backend\.env
    echo ACCESS_TOKEN_EXPIRE_MINUTES=30 >> backend\.env
    echo. >> backend\.env
    echo # Debug mode >> backend\.env
    echo DEBUG=false >> backend\.env
    echo. >> backend\.env
    echo # Monitoring >> backend\.env
    echo ENABLE_METRICS=true >> backend\.env
    echo LOG_LEVEL=INFO >> backend\.env
    echo ✅ Created backend/.env file
)

echo ✅ Environment setup completed

REM Build and start services
echo.
echo 🏗️  Building and starting services...

REM Pull latest images
docker-compose -f %COMPOSE_FILE% pull

REM Build custom images
docker-compose -f %COMPOSE_FILE% build --no-cache

REM Start services
docker-compose -f %COMPOSE_FILE% up -d

echo ✅ Services started successfully

REM Wait for services to be healthy
echo.
echo ⏳ Waiting for services to be healthy...

REM Wait for backend API (simple check)
echo Waiting for Backend API...
timeout /t 30 /nobreak >nul
echo ✅ Services should be ready

REM Display deployment information
echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📊 Application URLs:
echo    Frontend:          http://localhost:3000
echo    API Documentation: http://localhost:8000/docs
echo    MLflow UI:         http://localhost:5000
echo    Grafana Dashboard: http://localhost:3001 (admin/admin)
echo    Prometheus:        http://localhost:9090
echo.
echo 🔧 Management Commands:
echo    View logs:         docker-compose -f %COMPOSE_FILE% logs -f
echo    Stop services:     docker-compose -f %COMPOSE_FILE% down
echo    Restart services:  docker-compose -f %COMPOSE_FILE% restart
echo.
echo 📈 Monitoring:
echo    System metrics available in Grafana
echo    Application logs in backend/logs/
echo    ML experiments tracked in MLflow
echo.

pause