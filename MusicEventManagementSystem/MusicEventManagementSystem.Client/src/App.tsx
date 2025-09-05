import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./frontend/shared/components/Layout";
import Dashboard from "./frontend/ticket-sales/pages/Dashboard";
import Venues from "./frontend/ticket-sales/pages/Venues";
import Login from "./frontend/auth/pages/Login";
import Register from "./frontend/auth/pages/Register";
import ProtectedRoute from "./frontend/shared/components/ProtectedRoute";
import Zones from './frontend/ticket-sales/pages/Zones';
import Segments from './frontend/ticket-sales/pages/Segments';
import TicketTypes from './frontend/ticket-sales/pages/TicketTypes';
import Tickets from './frontend/ticket-sales/pages/Tickets';
import RecordedSales from './frontend/ticket-sales/pages/RecordedSales';
import PricingRules from './frontend/ticket-sales/pages/PricingRules';
import { Speech } from 'lucide-react';
import SpecialOffers from './frontend/ticket-sales/pages/SpecialOffer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/venues" 
          element={
            <ProtectedRoute>
              <Layout>
                <Venues />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/segments" 
          element={
            <ProtectedRoute>
              <Layout>
                <Segments />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/zones" 
          element={
            <ProtectedRoute>
              <Layout>
                <Zones />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-types" 
          element={
            <ProtectedRoute>
              <Layout>
                <TicketTypes />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tickets" 
          element={
            <ProtectedRoute>
              <Layout>
                <Tickets />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/pricing-rules" 
          element={
            <ProtectedRoute>
              <Layout>
                <PricingRules />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/special-offers" 
          element={
            <ProtectedRoute>
              <Layout>
                <SpecialOffers />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/recorded-sales" 
          element={
            <ProtectedRoute>
              <Layout>
                <RecordedSales />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;