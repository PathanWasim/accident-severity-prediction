import React from 'react';
import {
    Box,
    Heading,
    Text,
    Grid,
    GridItem,
    Card,
    CardHeader,
    CardBody,
    VStack,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    useColorModeValue,
    Spinner,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

const ModelPerformance: React.FC = () => {
    const cardBg = useColorModeValue('white', 'gray.800');

    const { data: modelMetrics, isLoading } = useQuery({
        queryKey: ['model-performance'],
        queryFn: apiService.getModelPerformance,
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" h="400px">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box>
                <Heading size="lg" mb={2}>
                    Model Performance
                </Heading>
                <Text color="gray.600">
                    Comprehensive evaluation of the machine learning model
                </Text>
            </Box>

            {/* Performance Metrics */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                <GridItem>
                    <Card bg={cardBg}>
                        <CardBody>
                            <Stat>
                                <StatLabel>Overall Accuracy</StatLabel>
                                <StatNumber>
                                    {modelMetrics ? `${(modelMetrics.accuracy * 100).toFixed(2)}%` : 'N/A'}
                                </StatNumber>
                                <StatHelpText>Model prediction accuracy</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardBody>
                            <Stat>
                                <StatLabel>Model Version</StatLabel>
                                <StatNumber fontSize="lg">
                                    {modelMetrics?.model_version || 'N/A'}
                                </StatNumber>
                                <StatHelpText>Current model version</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardBody>
                            <Stat>
                                <StatLabel>Last Updated</StatLabel>
                                <StatNumber fontSize="md">
                                    {modelMetrics ?
                                        new Date(modelMetrics.last_updated).toLocaleDateString() : 'N/A'}
                                </StatNumber>
                                <StatHelpText>Model training date</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>

            {/* Detailed Metrics */}
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Confusion Matrix</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={8}>
                                Interactive confusion matrix visualization showing true vs
                                predicted classifications would be displayed here.
                            </Text>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Feature Importance</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={8}>
                                Bar chart showing the most important features for prediction
                                would be displayed here.
                            </Text>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Precision & Recall</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={8}>
                                Detailed precision and recall metrics for each severity class
                                would be displayed here.
                            </Text>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Model Comparison</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={8}>
                                Comparison of different model versions and their performance
                                metrics would be displayed here.
                            </Text>
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>
        </VStack>
    );
};

export default ModelPerformance;