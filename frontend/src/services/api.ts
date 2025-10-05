import axios, { AxiosResponse } from 'axios';
import {
    AccidentPredictionRequest,
    AccidentPredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    ModelPerformanceMetrics,
    DataExplorationRequest,
    DataExplorationResponse,
    HealthCheckResponse,
} from '../types/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export class ApiService {
    // Prediction endpoints
    async predictAccidentSeverity(
        request: AccidentPredictionRequest
    ): Promise<AccidentPredictionResponse> {
        const response: AxiosResponse<AccidentPredictionResponse> = await api.post(
            '/predict',
            request
        );
        return response.data;
    }

    async predictBatch(
        request: BatchPredictionRequest
    ): Promise<BatchPredictionResponse> {
        const response: AxiosResponse<BatchPredictionResponse> = await api.post(
            '/predict/batch',
            request
        );
        return response.data;
    }

    // Model management
    async getModelPerformance(): Promise<ModelPerformanceMetrics> {
        const response: AxiosResponse<ModelPerformanceMetrics> = await api.get(
            '/model/performance'
        );
        return response.data;
    }

    async retrainModel(): Promise<{ message: string; status: string }> {
        const response = await api.post('/model/retrain');
        return response.data;
    }

    // Data exploration
    async exploreData(
        request: DataExplorationRequest
    ): Promise<DataExplorationResponse> {
        const response: AxiosResponse<DataExplorationResponse> = await api.post(
            '/data/explore',
            request
        );
        return response.data;
    }

    async getDataSummary(): Promise<any> {
        const response = await api.get('/data/summary');
        return response.data;
    }

    // Analytics
    async getAccidentTrends(period: string = 'monthly'): Promise<any> {
        const response = await api.get(`/analytics/trends?period=${period}`);
        return response.data;
    }

    async getRiskFactorAnalysis(): Promise<any> {
        const response = await api.get('/analytics/risk-factors');
        return response.data;
    }

    async getGeographicalAnalysis(): Promise<any> {
        const response = await api.get('/analytics/geographical');
        return response.data;
    }

    // Health check
    async getHealth(): Promise<HealthCheckResponse> {
        const response: AxiosResponse<HealthCheckResponse> = await api.get('/health');
        return response.data;
    }

    // WebSocket connection
    createWebSocketConnection(): WebSocket {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/predictions';
        return new WebSocket(wsUrl);
    }
}

// Export singleton instance
export const apiService = new ApiService();