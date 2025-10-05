// API Types for the Accident Prediction System

export enum AccidentSeverity {
    MINOR = 'Minor',
    MODERATE = 'Moderate',
    SEVERE = 'Severe',
}

export enum Country {
    USA = 'USA',
    UK = 'UK',
    CANADA = 'Canada',
    INDIA = 'India',
    CHINA = 'China',
    JAPAN = 'Japan',
}

export enum Month {
    JANUARY = 'January',
    FEBRUARY = 'February',
    MARCH = 'March',
    APRIL = 'April',
    MAY = 'May',
    JUNE = 'June',
    JULY = 'July',
    AUGUST = 'August',
    SEPTEMBER = 'September',
    OCTOBER = 'October',
    NOVEMBER = 'November',
    DECEMBER = 'December',
}

export enum DayOfWeek {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday',
}

export enum TimeOfDay {
    MORNING = 'Morning',
    AFTERNOON = 'Afternoon',
    EVENING = 'Evening',
    NIGHT = 'Night',
}

export enum UrbanRural {
    URBAN = 'Urban',
    RURAL = 'Rural',
}

export enum RoadType {
    HIGHWAY = 'Highway',
    MAIN_ROAD = 'Main Road',
    STREET = 'Street',
}

export enum WeatherConditions {
    CLEAR = 'Clear',
    RAINY = 'Rainy',
    SNOWY = 'Snowy',
    FOGGY = 'Foggy',
    WINDY = 'Windy',
}

export enum DriverAgeGroup {
    YOUNG = '18-25',
    MIDDLE = '26-40',
    SENIOR = '41-60',
    ELDERLY = '60+',
}

export enum DriverGender {
    MALE = 'Male',
    FEMALE = 'Female',
}

export enum VehicleCondition {
    GOOD = 'Good',
    MODERATE = 'Moderate',
    POOR = 'Poor',
}

export enum RoadCondition {
    DRY = 'Dry',
    WET = 'Wet',
    ICY = 'Icy',
    SNOW_COVERED = 'Snow-covered',
}

export enum AccidentCause {
    SPEEDING = 'Speeding',
    DISTRACTED_DRIVING = 'Distracted Driving',
    WEATHER = 'Weather',
    MECHANICAL_FAILURE = 'Mechanical Failure',
    HUMAN_ERROR = 'Human Error',
}

export interface AccidentPredictionRequest {
    // Location and time
    country: Country;
    month: Month;
    day_of_week: DayOfWeek;
    time_of_day: TimeOfDay;
    urban_rural: UrbanRural;

    // Road conditions
    road_type: RoadType;
    road_condition: RoadCondition;
    speed_limit: number;

    // Weather
    weather_conditions: WeatherConditions;
    visibility_level: number;

    // Vehicle information
    number_of_vehicles_involved: number;
    vehicle_condition: VehicleCondition;

    // Driver information
    driver_age_group: DriverAgeGroup;
    driver_gender: DriverGender;
    driver_alcohol_level: number;
    driver_fatigue: number;

    // Other factors
    pedestrians_involved: number;
    cyclists_involved: number;
    traffic_volume: number;
    population_density: number;
    accident_cause: AccidentCause;
}

export interface AccidentPredictionResponse {
    predicted_severity: AccidentSeverity;
    confidence_score: number;
    probabilities: Record<string, number>;
    risk_factors: string[];
    recommendations: string[];
    prediction_id: string;
    timestamp: string;
    model_version: string;
}

export interface ModelPerformanceMetrics {
    accuracy: number;
    precision: Record<string, number>;
    recall: Record<string, number>;
    f1_score: Record<string, number>;
    confusion_matrix: number[][];
    feature_importance: Record<string, number>;
    model_version: string;
    last_updated: string;
}

export interface DataExplorationRequest {
    feature: string;
    chart_type: 'histogram' | 'bar' | 'scatter' | 'box' | 'correlation';
    filters?: Record<string, any>;
}

export interface DataExplorationResponse {
    chart_data: Record<string, any>;
    statistics: Record<string, any>;
    insights: string[];
}

export interface HealthCheckResponse {
    status: string;
    ml_service: string;
    version: string;
    timestamp: string;
}

export interface BatchPredictionRequest {
    predictions: AccidentPredictionRequest[];
}

export interface BatchPredictionResponse {
    predictions: AccidentPredictionResponse[];
    batch_id: string;
    total_predictions: number;
    processing_time: number;
}

// WebSocket message types
export interface WebSocketMessage {
    type: 'prediction' | 'error' | 'system_status' | 'model_update';
    data?: any;
    message?: string;
    timestamp?: number;
}

// Chart data types
export interface ChartDataPoint {
    x: string | number;
    y: number;
    label?: string;
}

export interface TrendData {
    period: string;
    minor: number;
    moderate: number;
    severe: number;
    total: number;
}

export interface RiskFactorData {
    factor: string;
    impact_score: number;
    frequency: number;
    severity_correlation: number;
}

export interface GeographicalData {
    country: string;
    region?: string;
    accident_count: number;
    severity_distribution: Record<AccidentSeverity, number>;
    coordinates?: [number, number];
}