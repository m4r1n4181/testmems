import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./frontend/shared/components/Layout";
import Login from "./frontend/auth/pages/Login";
import Register from "./frontend/auth/pages/Register";
import ProtectedRoute from "./frontend/shared/components/ProtectedRoute";

// Ticket Sales imports
import TicketSalesDashboard from "./frontend/ticket-sales/pages/Dashboard";
import TicketSalesVenues from "./frontend/ticket-sales/pages/Venues";
import TicketSalesZones from './frontend/ticket-sales/pages/Zones';
import TicketSalesSegments from './frontend/ticket-sales/pages/Segments';
import TicketSalesTicketTypes from './frontend/ticket-sales/pages/TicketTypes';
import TicketSalesTickets from './frontend/ticket-sales/pages/Tickets';
import TicketSalesRecordedSales from './frontend/ticket-sales/pages/RecordedSales';
import TicketSalesPricingRules from './frontend/ticket-sales/pages/PricingRules';
import TicketSalesSpecialOffers from './frontend/ticket-sales/pages/SpecialOffer';

// Event Organization imports
import EventOrgDashboard from "./frontend/event-organization/pages/Dashboard";
import EventOrgEvents from './frontend/event-organization/pages/Events';
import EventOrgPerformances from './frontend/event-organization/pages/Performances';
import EventOrgWorkTasks from './frontend/event-organization/pages/WorkTasks';
import EventOrgCalendar from './frontend/event-organization/pages/Calendar';
import EventOrgResources from './frontend/event-organization/pages/Resources';
import EventOrgAnalytics from './frontend/event-organization/pages/Analytics';

// Helper function to get user's department
const getUserDepartment = (): number | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.department;
  } catch {
    return null;
  }
};

// Component to redirect to appropriate dashboard based on department
const DepartmentRedirect = () => {
  const department = getUserDepartment();
  
  switch (department) {
    case 1: // TicketSales
      return <Navigate to="/ticket-sales/dashboard" replace />;
    case 2: // EventOrganization
      return <Navigate to="/event-organization/dashboard" replace />;
    case 3: // ArtistCommunication
      return <Navigate to="/artist-communication/dashboard" replace />;
    case 4: // MediaCampaign
      return <Navigate to="/media-campaign/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Department redirect route */}
        {/* <Route path="/dashboard" element={<DepartmentRedirect />} /> */}

        {/* Protected routes - Ticket Sales*/}
        <Route path="/ticket-sales/dashboard" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-sales/venues" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesVenues />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-sales/segments" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesSegments />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-sales/zones" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesZones />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-sales/ticket-types" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesTicketTypes />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-sales/tickets" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesTickets />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-sales/pricing-rules" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesPricingRules />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-sales/special-offers" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesSpecialOffers />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/ticket-sales/recorded-sales" 
          element={
            <ProtectedRoute allowedDepartments={[1]}>
              <Layout>
                <TicketSalesRecordedSales />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Protected routes - Event Management*/}
        <Route path="/event-organization/dashboard" 
          element={
            <ProtectedRoute allowedDepartments={[2]}>
              <Layout>
                <EventOrgDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/event-organization/events" 
          element={
            <ProtectedRoute allowedDepartments={[2]}>
              <Layout>
                <EventOrgEvents />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/event-organization/performances" 
          element={
            <ProtectedRoute allowedDepartments={[2]}>
              <Layout>
                <EventOrgPerformances />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/event-organization/work-tasks" 
          element={
            <ProtectedRoute allowedDepartments={[2]}>
              <Layout>
                <EventOrgWorkTasks />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/event-organization/calendar" 
          element={
            <ProtectedRoute allowedDepartments={[2]}>
              <Layout>
                <EventOrgCalendar />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/event-organization/resources" 
          element={
            <ProtectedRoute allowedDepartments={[2]}>
              <Layout>
                <EventOrgResources />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/event-organization/analytics" 
          element={
            <ProtectedRoute allowedDepartments={[2]}>
              <Layout>
                <EventOrgAnalytics />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<DepartmentRedirect />} />
        
        {/* Catch all - redirect to appropriate dashboard */}
        <Route path="*" element={<DepartmentRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;