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
    useColorModeValue,
} from '@chakra-ui/react';

const DataExploration: React.FC = () => {
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box>
                <Heading size="lg" mb={2}>
                    Data Exploration
                </Heading>
                <Text color="gray.600">
                    Interactive exploration of the accident dataset
                </Text>
            </Box>

            {/* Exploration Grid */}
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Feature Distributions</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={8}>
                                Interactive histograms and distribution plots for each feature
                                would be displayed here with filtering capabilities.
                            </Text>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Correlation Matrix</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={8}>
                                Interactive correlation heatmap showing relationships between
                                different variables would be displayed here.
                            </Text>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Statistical Summary</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={8}>
                                Comprehensive statistical summary including mean, median, mode,
                                standard deviation for all features would be displayed here.
                            </Text>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Data Quality</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text color="gray.500" textAlign="center" py={8}>
                                Data quality metrics including missing values, outliers,
                                and data completeness would be displayed here.
                            </Text>
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>
        </VStack>
    );
};

export default DataExploration;