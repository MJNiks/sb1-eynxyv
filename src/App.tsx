import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClinicProvider } from './context/ClinicContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NiksAI from './pages/NiksAI';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ClinicProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="niks-ai" element={<NiksAI />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ClinicProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;