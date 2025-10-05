#!/bin/bash

# Enhanced Accident Prediction System Deployment Script
# This script handles the complete deployment of the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-development}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

echo -e "${BLUE}🚀 Starting deployment for ${ENVIRONMENT} environment${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    echo -e "${BLUE}🔧 Setting up environment...${NC}"
    
    # Create necessary directories
    mkdir -p backend/data
    mkdir -p backend/models
    mkdir -p backend/logs
    mkdir -p ml-pipeline/experiments
    
    # Copy dataset if it exists
    if [ -f "road_accident_dataset.csv" ]; then
        cp road_accident_dataset.csv backend/data/
        print_status "Dataset copied to backend/data/"
    else
        print_warning "Dataset not found. Please ensure road_accident_dataset.csv is available."
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# Database
DATABASE_URL=postgresql://postgres:password@db:5432/accident_prediction

# Redis
REDIS_URL=redis://redis:6379

# Security
SECRET_KEY=$(openssl rand -hex 32)
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Debug mode
DEBUG=false

# Monitoring
ENABLE_METRICS=true
LOG_LEVEL=INFO
EOF
        print_status "Created backend/.env file"
    fi
    
    print_status "Environment setup completed"
}

# Build and start services
deploy_services() {
    echo -e "${BLUE}🏗️  Building and starting services...${NC}"
    
    # Pull latest images
    docker-compose -f $COMPOSE_FILE pull
    
    # Build custom images
    docker-compose -f $COMPOSE_FILE build --no-cache
    
    # Start services
    docker-compose -f $COMPOSE_FILE up -d
    
    print_status "Services started successfully"
}

# Wait for services to be healthy
wait_for_services() {
    echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
    
    # Wait for database
    echo "Waiting for PostgreSQL..."
    until docker-compose -f $COMPOSE_FILE exec -T db pg_isready -U postgres; do
        sleep 2
    done
    print_status "PostgreSQL is ready"
    
    # Wait for Redis
    echo "Waiting for Redis..."
    until docker-compose -f $COMPOSE_FILE exec -T redis redis-cli ping; do
        sleep 2
    done
    print_status "Redis is ready"
    
    # Wait for backend API
    echo "Waiting for Backend API..."
    until curl -f http://localhost:8000/health > /dev/null 2>&1; do
        sleep 5
    done
    print_status "Backend API is ready"
    
    # Wait for frontend
    echo "Waiting for Frontend..."
    until curl -f http://localhost:3000 > /dev/null 2>&1; do
        sleep 5
    done
    print_status "Frontend is ready"
}

# Run database migrations and setup
setup_database() {
    echo -e "${BLUE}🗄️  Setting up database...${NC}"
    
    # Create database tables (if using migrations)
    # docker-compose -f $COMPOSE_FILE exec backend python -m alembic upgrade head
    
    print_status "Database setup completed"
}

# Run health checks
run_health_checks() {
    echo -e "${BLUE}🏥 Running health checks...${NC}"
    
    # Check API health
    API_HEALTH=$(curl -s http://localhost:8000/health | jq -r '.status')
    if [ "$API_HEALTH" = "healthy" ]; then
        print_status "API health check passed"
    else
        print_error "API health check failed"
        exit 1
    fi
    
    # Check ML service
    ML_HEALTH=$(curl -s http://localhost:8000/health | jq -r '.ml_service')
    if [ "$ML_HEALTH" = "healthy" ]; then
        print_status "ML service health check passed"
    else
        print_warning "ML service health check failed - model may need training"
    fi
}

# Display deployment information
show_deployment_info() {
    echo -e "${GREEN}"
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📊 Application URLs:"
    echo "   Frontend:          http://localhost:3000"
    echo "   API Documentation: http://localhost:8000/docs"
    echo "   MLflow UI:         http://localhost:5000"
    echo "   Grafana Dashboard: http://localhost:3001 (admin/admin)"
    echo "   Prometheus:        http://localhost:9090"
    echo ""
    echo "🔧 Management Commands:"
    echo "   View logs:         docker-compose -f $COMPOSE_FILE logs -f"
    echo "   Stop services:     docker-compose -f $COMPOSE_FILE down"
    echo "   Restart services:  docker-compose -f $COMPOSE_FILE restart"
    echo ""
    echo "📈 Monitoring:"
    echo "   System metrics available in Grafana"
    echo "   Application logs in backend/logs/"
    echo "   ML experiments tracked in MLflow"
    echo -e "${NC}"
}

# Cleanup function
cleanup() {
    if [ $? -ne 0 ]; then
        print_error "Deployment failed. Cleaning up..."
        docker-compose -f $COMPOSE_FILE down
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# Main deployment flow
main() {
    echo -e "${BLUE}🚀 Enhanced Accident Prediction System Deployment${NC}"
    echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
    echo ""
    
    check_prerequisites
    setup_environment
    deploy_services
    wait_for_services
    setup_database
    run_health_checks
    show_deployment_info
}

# Run main function
main

# Remove trap on successful completion
trap - EXIT