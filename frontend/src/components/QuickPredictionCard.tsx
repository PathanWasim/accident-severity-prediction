import React, { useState } from 'react';
import {
    VStack,
    Button,
    Select,
    Text,
    Alert,
    AlertIcon,
    Spinner,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { AccidentPredictionRequest } from '../types/api';

const QuickPredictionCard: React.FC = () => {
    const [quickParams, setQuickParams] = useState({
        weather: 'Clear',
        roadType: 'Street',
        timeOfDay: 'Morning',
    });

    const quickPredictionMutation = useMutation({
        mutationFn: apiService.predictAccidentSeverity,
    });

    const handleQuickPredict = () => {
        const request: AccidentPredictionRequest = {
            country: 'USA',
            month: 'January',
            day_of_week: 'Monday',
            time_of_day: quickParams.timeOfDay as any,
            urban_rural: 'Urban',
            road_type: quickParams.roadType as any,
            road_condition: 'Dry',
            speed_limit: 50,
            weather_conditions: quickParams.weather as any,
            visibility_level: 500,
            number_of_vehicles_involved: 2,
            vehicle_condition: 'Good',
            driver_age_group: '26-40',
            driver_gender: 'Male',
            driver_alcohol_level: 0.0,
            driver_fatigue: 0,
            pedestrians_involved: 0,
            cyclists_involved: 0,
            traffic_volume: 1000,
            population_density: 2000,
            accident_cause: 'Human Error',
        };

        quickPredictionMutation.mutate(request);
    };

    return (
        <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
                Quick prediction with common parameters
            </Text>

            <Select
                value={quickParams.weather}
                onChange={(e) => setQuickParams({ ...quickParams, weather: e.target.value })}
                size="sm"
            >
                <option value="Clear">Clear Weather</option>
                <option value="Rainy">Rainy</option>
                <option value="Snowy">Snowy</option>
                <option value="Foggy">Foggy</option>
            </Select>

            <Select
                value={quickParams.roadType}
                onChange={(e) => setQuickParams({ ...quickParams, roadType: e.target.value })}
                size="sm"
            >
                <option value="Street">Street</option>
                <option value="Highway">Highway</option>
                <option value="Main Road">Main Road</option>
            </Select>

            <Select
                value={quickParams.timeOfDay}
                onChange={(e) => setQuickParams({ ...quickParams, timeOfDay: e.target.value })}
                size="sm"
            >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
            </Select>

            <Button
                onClick={handleQuickPredict}
                isLoading={quickPredictionMutation.isPending}
                size="sm"
            >
                Quick Predict
            </Button>

            {quickPredictionMutation.data && (
                <Alert status="info" size="sm">
                    <AlertIcon />
                    <Text fontSize="xs">
                        Predicted: {quickPredictionMutation.data.predicted_severity}
                    </Text>
                </Alert>
            )}

            {quickPredictionMutation.isPending && <Spinner size="sm" />}
        </VStack>
    );
};

export default QuickPredictionCard;