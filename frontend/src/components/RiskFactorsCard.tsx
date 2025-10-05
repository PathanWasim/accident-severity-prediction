import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Heading,
    VStack,
    Text,
    List,
    ListItem,
    ListIcon,
    Badge,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

interface RiskFactorsCardProps {
    riskFactors: string[];
    recommendations: string[];
}

const RiskFactorsCard: React.FC<RiskFactorsCardProps> = ({
    riskFactors,
    recommendations
}) => {
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <VStack spacing={4} align="stretch">
            {/* Risk Factors */}
            <Card bg={cardBg}>
                <CardHeader>
                    <Heading size="md" color="red.500">
                        Risk Factors Identified
                    </Heading>
                </CardHeader>
                <CardBody>
                    {riskFactors.length > 0 ? (
                        <List spacing={2}>
                            {riskFactors.map((factor, index) => (
                                <ListItem key={index} fontSize="sm">
                                    <ListIcon as={FiAlertTriangle} color="red.500" />
                                    {factor}
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Text fontSize="sm" color="gray.500">
                            No significant risk factors identified
                        </Text>
                    )}
                </CardBody>
            </Card>

            {/* Recommendations */}
            <Card bg={cardBg}>
                <CardHeader>
                    <Heading size="md" color="green.500">
                        Safety Recommendations
                    </Heading>
                </CardHeader>
                <CardBody>
                    {recommendations.length > 0 ? (
                        <List spacing={2}>
                            {recommendations.map((recommendation, index) => (
                                <ListItem key={index} fontSize="sm">
                                    <ListIcon as={FiCheckCircle} color="green.500" />
                                    {recommendation}
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Text fontSize="sm" color="gray.500">
                            No specific recommendations at this time
                        </Text>
                    )}
                </CardBody>
            </Card>
        </VStack>
    );
};

export default RiskFactorsCard;