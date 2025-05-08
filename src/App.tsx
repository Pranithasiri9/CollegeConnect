import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import Layout from './components/layout/Layout';

// Page components
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import RegistrationConfirmationPage from './pages/RegistrationConfirmationPage';

// Context providers
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="events/:eventId" element={<EventDetailsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/create-event" element={<CreateEventPage />} />
            <Route path="confirmation/:registrationId" element={<RegistrationConfirmationPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;