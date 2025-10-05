import React from 'react';
import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    IconButton,
    useDisclosure,
    useColorModeValue,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const location = useLocation();

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box minH="100vh">
            <Flex>
                {/* Desktop Sidebar */}
                <Box
                    display={{ base: 'none', md: 'block' }}
                    w="250px"
                    bg={bg}
                    borderRight="1px"
                    borderColor={borderColor}
                    position="fixed"
                    h="100vh"
                    overflowY="auto"
                >
                    <Sidebar />
                </Box>

                {/* Mobile Drawer */}
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Navigation</DrawerHeader>
                        <DrawerBody p={0}>
                            <Sidebar onClose={onClose} />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Main Content */}
                <Box
                    flex="1"
                    ml={{ base: 0, md: '250px' }}
                    transition="margin-left 0.3s"
                >
                    {/* Header */}
                    <Box
                        bg={bg}
                        borderBottom="1px"
                        borderColor={borderColor}
                        px={4}
                        py={3}
                        position="sticky"
                        top={0}
                        zIndex={10}
                    >
                        <Flex justify="space-between" align="center">
                            <HStack>
                                <IconButton
                                    display={{ base: 'flex', md: 'none' }}
                                    onClick={onOpen}
                                    variant="outline"
                                    aria-label="Open menu"
                                    icon={<HamburgerIcon />}
                                />
                                <Header />
                            </HStack>

                            <HStack spacing={4}>
                                <IconButton
                                    aria-label="Toggle color mode"
                                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                                    onClick={toggleColorMode}
                                    variant="ghost"
                                />
                            </HStack>
                        </Flex>
                    </Box>

                    {/* Page Content */}
                    <Box p={6}>
                        {children}
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default Layout;