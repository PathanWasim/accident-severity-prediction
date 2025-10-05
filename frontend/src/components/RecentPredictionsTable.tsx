import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Text,
} from '@chakra-ui/react';

const RecentPredictionsTable: React.FC = () => {
    // Mock data - in real app, this would come from API
    const recentPredictions = [
        {
            id: '1',
            timestamp: '2024-01-15 10:30',
            severity: 'Minor',
            confidence: 0.85,
            location: 'Urban Street',
        },
        {
            id: '2',
            timestamp: '2024-01-15 10:25',
            severity: 'Moderate',
            confidence: 0.72,
            location: 'Highway',
        },
        {
            id: '3',
            timestamp: '2024-01-15 10:20',
            severity: 'Severe',
            confidence: 0.91,
            location: 'Rural Road',
        },
    ];

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
        <Table size="sm">
            <Thead>
                <Tr>
                    <Th>Time</Th>
                    <Th>Severity</Th>
                    <Th>Confidence</Th>
                    <Th>Location</Th>
                </Tr>
            </Thead>
            <Tbody>
                {recentPredictions.map((prediction) => (
                    <Tr key={prediction.id}>
                        <Td>
                            <Text fontSize="xs">{prediction.timestamp}</Text>
                        </Td>
                        <Td>
                            <Badge colorScheme={getSeverityColor(prediction.severity)}>
                                {prediction.severity}
                            </Badge>
                        </Td>
                        <Td>
                            <Text fontSize="xs">{(prediction.confidence * 100).toFixed(0)}%</Text>
                        </Td>
                        <Td>
                            <Text fontSize="xs">{prediction.location}</Text>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default RecentPredictionsTable;