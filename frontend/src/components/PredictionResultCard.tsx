import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Heading,
    VStack,
    HStack,
    Text,
    Badge,
    Progress,
    useColorModeValue,
} from '@chakra-ui/react';
import { AccidentPredictionResponse } from '../types/api';

interface PredictionResultCardProps {
    prediction: AccidentPredictionResponse;
}

const PredictionResultCard: React.FC<PredictionResultCardProps> = ({ prediction }) => {
    const cardBg = useColorModeValue('white', 'gray.800');

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Minor':
                return 'green';
            case 'Moderate':
                return 'yellow';
            case 'Severe':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Card bg={cardBg}>
            <CardHeader>
                <Heading size="md">Prediction Result</Heading>
            </CardHeader>
            <CardBody>
                <VStack spacing={4} align="stretch">
                    {/* Main Result */}
                    <HStack justify="space-between" align="center">
                        <Text fontWeight="semibold">Predicted Severity:</Text>
                        <Badge
                            colorScheme={getSeverityColor(prediction.predicted_severity)}
                            fontSize="md"
                            px={3}
                            py={1}
                        >
                            {prediction.predicted_severity}
                        </Badge>
                    </HStack>

                    {/* Confidence Score */}
                    <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                            <Text fontSize="sm">Confidence Score:</Text>
                            <Text fontSize="sm" fontWeight="semibold">
                                {(prediction.confidence_score * 100).toFixed(1)}%
                            </Text>
                        </HStack>
                        <Progress
                            value={prediction.confidence_score * 100}
                            colorScheme={getSeverityColor(prediction.predicted_severity)}
                            size="sm"
                        />
                    </VStack>

                    {/* Probabilities */}
                    <VStack align="stretch" spacing={2}>
                        <Text fontSize="sm" fontWeight="semibold">Probability Breakdown:</Text>
                        {Object.entries(prediction.probabilities).map(([severity, prob]) => (
                            <HStack key={severity} justify="space-between">
                                <Text fontSize="xs">{severity}:</Text>
                                <Text fontSize="xs">{(prob * 100).toFixed(1)}%</Text>
                            </HStack>
                        ))}
                    </VStack>

                    {/* Metadata */}
                    <VStack align="stretch" spacing={1}>
                        <Text fontSize="xs" color="gray.500">
                            Prediction ID: {prediction.prediction_id}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            Model Version: {prediction.model_version}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            Timestamp: {new Date(prediction.timestamp).toLocaleString()}
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default PredictionResultCard;