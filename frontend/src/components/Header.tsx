import React from 'react';
import { Text, useColorModeValue } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();
    const textColor = useColorModeValue('gray.700', 'gray.200');

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'Dashboard';
            case '/prediction':
                return 'Accident Prediction';
            case '/analytics':
                return 'Analytics';
            case '/data-exploration':
                return 'Data Exploration';
            case '/model-performance':
                return 'Model Performance';
            default:
                return 'Accident Prediction System';
        }
    };

    return (
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            {getPageTitle()}
        </Text>
    );
};

export default Header;