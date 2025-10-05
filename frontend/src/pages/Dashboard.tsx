import React from 'react';
import {
    Box,
    Grid,
    GridItem,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Card,
    CardHeader,
    CardBody,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    useColorModeValue,
    Spinner,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

import { apiService } from '../services/api';
import QuickPredictionCard from '../components/QuickPredictionCard';
import RecentPredictionsTable from '../components/RecentPredictionsTable';
import TrendChart from '../components/TrendChart';

const Dashboard: React.FC = () => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const statBg = useColorModeValue('blue.50', 'blue.900');

    // Fetch dashboard data
    const { data: healthData, isLoading: healthLoading } = useQuery({
        queryKey: ['health'],
        queryFn: apiService.getHealth,
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const { data: modelMetrics, isLoading: metricsLoading } = useQuery({
        queryKey: ['model-performance'],
        queryFn: apiService.getModelPerformance,
    });

    const { data: dataSummary, isLoading: summaryLoading } = useQuery({
        queryKey: ['data-summary'],
        queryFn: apiService.getDataSummary,
    });

    const { data: trends, isLoading: trendsLoading } = useQuery({
        queryKey: ['trends'],
        queryFn: () => apiService.getAccidentTrends('monthly'),
    });

    if (healthLoading || metricsLoading || summaryLoading) {
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
                    Accident Severity Prediction Dashboard
                </Heading>
                <Text color="gray.600">
                    Real-time insights and predictions for road accident severity
                </Text>
            </Box>

            {/* System Status */}
            {healthData && (
                <Alert
                    status={healthData.status === 'healthy' ? 'success' : 'error'}
                    borderRadius="md"
                >
                    <AlertIcon />
                    System Status: {healthData.status === 'healthy' ? 'All systems operational' : 'Service issues detected'}
                </Alert>
            )}

            {/* Key Metrics */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
                <GridItem>
                    <Card bg={cardBg}>
                        <CardBody>
                            <Stat>
                                <StatLabel>Model Accuracy</StatLabel>
                                <StatNumber>
                                    {modelMetrics ? `${(modelMetrics.accuracy * 100).toFixed(1)}%` : 'N/A'}
                                </StatNumber>
                                <StatHelpText>
                                    <StatArrow type="increase" />
                                    Current model performance
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardBody>
                            <Stat>
                                <StatLabel>Total Records</StatLabel>
                                <StatNumber>
                                    {dataSummary ? dataSummary.total_records?.toLocaleString() : 'N/A'}
                                </StatNumber>
                                <StatHelpText>Training dataset size</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardBody>
                            <Stat>
                                <StatLabel>Features</StatLabel>
                                <StatNumber>
                                    {dataSummary ? dataSummary.feature_count : 'N/A'}
                                </StatNumber>
                                <StatHelpText>Input parameters</StatHelpText>
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
                                    {modelMetrics ? modelMetrics.model_version : 'N/A'}
                                </StatNumber>
                                <StatHelpText>
                                    Last updated: {modelMetrics ?
                                        new Date(modelMetrics.last_updated).toLocaleDateString() : 'N/A'}
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>

            {/* Main Content Grid */}
            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                {/* Left Column */}
                <GridItem>
                    <VStack spacing={6} align="stretch">
                        {/* Trend Chart */}
                        <Card bg={cardBg}>
                            <CardHeader>
                                <Heading size="md">Accident Trends</Heading>
                            </CardHeader>
                            <CardBody>
                                {trendsLoading ? (
                                    <Box display="flex" justifyContent="center" p={8}>
                                        <Spinner />
                                    </Box>
                                ) : trends ? (
                                    <TrendChart data={trends} />
                                ) : (
                                    <Text>No trend data available</Text>
                                )}
                            </CardBody>
                        </Card>

                        {/* Recent Predictions */}
                        <Card bg={cardBg}>
                            <CardHeader>
                                <Heading size="md">Recent Predictions</Heading>
                            </CardHeader>
                            <CardBody>
                                <RecentPredictionsTable />
                            </CardBody>
                        </Card>
                    </VStack>
                </GridItem>

                {/* Right Column */}
                <GridItem>
                    <VStack spacing={6} align="stretch">
                        {/* Quick Prediction */}
                        <Card bg={cardBg}>
                            <CardHeader>
                                <Heading size="md">Quick Prediction</Heading>
                            </CardHeader>
                            <CardBody>
                                <QuickPredictionCard />
                            </CardBody>
                        </Card>

                        {/* Severity Distribution */}
                        <Card bg={cardBg}>
                            <CardHeader>
                                <Heading size="md">Severity Distribution</Heading>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={3} align="stretch">
                                    <HStack justify="space-between">
                                        <Text>Minor</Text>
                                        <Badge colorScheme="green">45%</Badge>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text>Moderate</Text>
                                        <Badge colorScheme="yellow">35%</Badge>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text>Severe</Text>
                                        <Badge colorScheme="red">20%</Badge>
                                    </HStack>
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* Top Risk Factors */}
                        <Card bg={cardBg}>
                            <CardHeader>
                                <Heading size="md">Top Risk Factors</Heading>
                            </CardHeader>
                            <CardBody>
                                <VStack spacing={2} align="stretch">
                                    <Text fontSize="sm">• Adverse weather conditions</Text>
                                    <Text fontSize="sm">• High speed limits</Text>
                                    <Text fontSize="sm">• Poor road conditions</Text>
                                    <Text fontSize="sm">• Driver fatigue</Text>
                                    <Text fontSize="sm">• Low visibility</Text>
                                </VStack>
                            </CardBody>
                        </Card>
                    </VStack>
                </GridItem>
            </Grid>
        </VStack>
    );
};

export default Dashboard;