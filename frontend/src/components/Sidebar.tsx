import React from 'react';
import {
    Box,
    VStack,
    Text,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiTarget,
    FiBarChart3,
    FiDatabase,
    FiActivity,
} from 'react-icons/fi';

interface SidebarProps {
    onClose?: () => void;
}

const menuItems = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'Prediction', path: '/prediction', icon: FiTarget },
    { name: 'Analytics', path: '/analytics', icon: FiBarChart3 },
    { name: 'Data Exploration', path: '/data-exploration', icon: FiDatabase },
    { name: 'Model Performance', path: '/model-performance', icon: FiActivity },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const location = useLocation();
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box bg={bg} w="full" h="full">
            {/* Logo */}
            <Box p={6} borderBottom="1px" borderColor={borderColor}>
                <Text fontSize="xl" fontWeight="bold" color="blue.500">
                    Accident Predictor
                </Text>
                <Text fontSize="sm" color="gray.500">
                    ML-Powered Safety System
                </Text>
            </Box>

            {/* Navigation */}
            <VStack spacing={1} align="stretch" p={4}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        style={{ textDecoration: 'none' }}
                    >
                        <Box
                            p={3}
                            borderRadius="md"
                            bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
                            color={location.pathname === item.path ? 'blue.600' : 'gray.600'}
                            _hover={{
                                bg: 'blue.50',
                                color: 'blue.600',
                            }}
                            display="flex"
                            alignItems="center"
                            gap={3}
                        >
                            <Icon as={item.icon} />
                            <Text fontSize="sm" fontWeight="medium">
                                {item.name}
                            </Text>
                        </Box>
                    </NavLink>
                ))}
            </VStack>
        </Box>
    );
};

export default Sidebar;