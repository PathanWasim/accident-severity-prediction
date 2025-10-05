import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Analytics from './pages/Analytics';
import DataExploration from './pages/DataExploration';
import ModelPerformance from './pages/ModelPerformance';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <Router>
                    <Box minH="100vh" bg="gray.50">
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/prediction" element={<Prediction />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/data-exploration" element={<DataExploration />} />
                                <Route path="/model-performance" element={<ModelPerformance />} />
                            </Routes>
                        </Layout>
                    </Box>
                </Router>
            </ChakraProvider>
        </QueryClientProvider>
    );
}

export default App;