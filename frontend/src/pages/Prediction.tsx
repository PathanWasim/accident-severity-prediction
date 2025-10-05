import React, { useState } from 'react';
import {
    Box,
    Grid,
    GridItem,
    Card,
    CardHeader,
    CardBody,
    Heading,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Select,
    NumberInput,
    NumberInputField,
    Button,
    Alert,
    AlertIcon,
    Badge,
    Text,
    Divider,
    useColorModeValue,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { apiService } from '../services/api';
import { AccidentPredictionRequest, AccidentPredictionResponse } from '../types/api';
import PredictionResultCard from '../components/PredictionResultCard';
import RiskFactorsCard from '../components/RiskFactorsCard';

const Prediction: React.FC = () => {
    const [predictionResult, setPredictionResult] = useState<AccidentPredictionResponse | null>(null);
    const cardBg = useColorModeValue('white', 'gray.800');
    const toast = useToast();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<AccidentPredictionRequest>();

    const predictionMutation = useMutation({
        mutationFn: apiService.predictAccidentSeverity,
        onSuccess: (data) => {
            setPredictionResult(data);
            toast({
                title: 'Prediction Complete',
                description: `Predicted severity: ${data.predicted_severity}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Prediction Failed',
                description: error.message || 'An error occurred during prediction',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        },
    });

    const onSubmit = (data: AccidentPredictionRequest) => {
        predictionMutation.mutate(data);
    };

    const handleReset = () => {
        reset();
        setPredictionResult(null);
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box>
                <Heading size="lg" mb={2}>
                    Accident Severity Prediction
                </Heading>
                <Text color="gray.600">
                    Enter accident parameters to predict severity level
                </Text>
            </Box>

            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                {/* Input Form */}
                <GridItem>
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Heading size="md">Input Parameters</Heading>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <VStack spacing={4} align="stretch">
                                    {/* Location & Time */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Location & Time</Text>
                                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                            <FormControl isRequired>
                                                <FormLabel>Country</FormLabel>
                                                <Controller
                                                    name="country"
                                                    control={control}
                                                    rules={{ required: 'Country is required' }}
                                                    render={({ field }) => (
                                                        <Select {...field} placeholder="Select country">
                                                            <option value="USA">USA</option>
                                                            <option value="UK">UK</option>
                                                            <option value="Canada">Canada</option>
                                                            <option value="India">India</option>
                                                            <option value="China">China</option>
                                                            <option value="Japan">Japan</option>
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Month</FormLabel>
                                                <Controller
                                                    name="month"
                                                    control={control}
                                                    rules={{ required: 'Month is required' }}
                                                    render={({ field }) => (
                                                        <Select {...field} placeholder="Select month">
                                                            <option value="January">January</option>
                                                            <option value="February">February</option>
                                                            <option value="March">March</option>
                                                            <option value="April">April</option>
                                                            <option value="May">May</option>
                                                            <option value="June">June</option>
                                                            <option value="July">July</option>
                                                            <option value="August">August</option>
                                                            <option value="September">September</option>
                                                            <option value="October">October</option>
                                                            <option value="November">November</option>
                                                            <option value="December">December</option>
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Day of Week</FormLabel>
                                                <Controller
                                                    name="day_of_week"
                                                    control={control}
                                                    rules={{ required: 'Day of week is required' }}
                                                    render={({ field }) => (
                                                        <Select {...field} placeholder="Select day">
                                                            <option value="Monday">Monday</option>
                                                            <option value="Tuesday">Tuesday</option>
                                                            <option value="Wednesday">Wednesday</option>
                                                            <option value="Thursday">Thursday</option>
                                                            <option value="Friday">Friday</option>
                                                            <option value="Saturday">Saturday</option>
                                                            <option value="Sunday">Sunday</option>
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Time of Day</FormLabel>
                                                <Controller
                                                    name="time_of_day"
                                                    control={control}
                                                    rules={{ required: 'Time of day is required' }}
                                                    render={({ field }) => (
                                                        <Select {...field} placeholder="Select time">
                                                            <option value="Morning">Morning</option>
                                                            <option value="Afternoon">Afternoon</option>
                                                            <option value="Evening">Evening</option>
                                                            <option value="Night">Night</option>
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Box>

                                    <Divider />

                                    {/* Road Conditions */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Road Conditions</Text>
                                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                            <FormControl isRequired>
                                                <FormLabel>Urban/Rural</FormLabel>
                                                <Controller
                                                    name="urban_rural"
                                                    control={control}
                                                    rules={{ required: 'Urban/Rural is required' }}
                                                    render={({ field }) => (
                                                        <Select {...field} placeholder="Select type">
                                                            <option value="Urban">Urban</option>
                                                            <option value="Rural">Rural</option>
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Road Type</FormLabel>
                                                <Controller
                                                    name="road_type"
                                                    control={control}
                                                    rules={{ required: 'Road type is required' }}
                                                    render={({ field }) => (
                                                        <Select {...field} placeholder="Select road type">
                                                            <option value="Highway">Highway</option>
                                                            <option value="Main Road">Main Road</option>
                                                            <option value="Street">Street</option>
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Road Condition</FormLabel>
                                                <Controller
                                                    name="road_condition"
                                                    control={control}
                                                    rules={{ required: 'Road condition is required' }}
                                                    render={({ field }) => (
                                                        <Select {...field} placeholder="Select condition">
                                                            <option value="Dry">Dry</option>
                                                            <option value="Wet">Wet</option>
                                                            <option value="Icy">Icy</option>
                                                            <option value="Snow-covered">Snow-covered</option>
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Speed Limit (km/h)</FormLabel>
                                                <Controller
                                                    name="speed_limit"
                                                    control={control}
                                                    rules={{
                                                        required: 'Speed limit is required',
                                                        min: { value: 0, message: 'Speed limit must be positive' },
                                                        max: { value: 200, message: 'Speed limit cannot exceed 200 km/h' }
                                                    }}
                                                    render={({ field }) => (
                                                        <NumberInput {...field} min={0} max={200}>
                                                            <NumberInputField />
                                                        </NumberInput>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Box>

                                    <Divider />

                                    {/* Weather Conditions */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={3}>Weather Conditions</Text>
                                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                            <FormControl isRequired>
                                                <FormLabel>Weather</FormLabel>
                                                <Controller
                                                    name="weather_conditions"
                                                    control={control}
                                                    rules={{ required: 'Weather condition is required' }}
                                                    render={({ field }) => (
                                                        <Select {...field} placeholder="Select weather">
                                                            <option value="Clear">Clear</option>
                                                            <option value="Rainy">Rainy</option>
                                                            <option value="Snowy">Snowy</option>
                                                            <option value="Foggy">Foggy</option>
                                                            <option value="Windy">Windy</option>
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Visibility (meters)</FormLabel>
                                                <Controller
                                                    name="visibility_level"
                                                    control={control}
                                                    rules={{
                                                        required: 'Visibility level is required',
                                                        min: { value: 0, message: 'Visibility must be positive' },
                                                        max: { value: 1000, message: 'Visibility cannot exceed 1000m' }
                                                    }}
                                                    render={({ field }) => (
                                                        <NumberInput {...field} min={0} max={1000}>
                                                            <NumberInputField />
                                                        </NumberInput>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Box>

                                    {/* Action Buttons */}
                                    <HStack spacing={4} pt={4}>
                                        <Button
                                            type="submit"
                                            colorScheme="blue"
                                            isLoading={predictionMutation.isPending}
                                            loadingText="Predicting..."
                                            flex={1}
                                        >
                                            Predict Severity
                                        </Button>
                                        <Button variant="outline" onClick={handleReset}>
                                            Reset
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </CardBody>
                    </Card>
                </GridItem>

                {/* Results */}
                <GridItem>
                    <VStack spacing={6} align="stretch">
                        {/* Prediction Result */}
                        {predictionResult && (
                            <PredictionResultCard prediction={predictionResult} />
                        )}

                        {/* Risk Factors */}
                        {predictionResult && (
                            <RiskFactorsCard
                                riskFactors={predictionResult.risk_factors}
                                recommendations={predictionResult.recommendations}
                            />
                        )}

                        {/* Placeholder when no prediction */}
                        {!predictionResult && (
                            <Card bg={cardBg}>
                                <CardBody>
                                    <VStack spacing={4} py={8}>
                                        <Text color="gray.500" textAlign="center">
                                            Fill out the form and click "Predict Severity" to see results
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                        )}
                    </VStack>
                </GridItem>
            </Grid>
        </VStack>
    );
};

export default Prediction;