import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Analytics from './pages/Analytics';
import Roadmap from './pages/Roadmap';
import Notes from './pages/Notes';
import ContestTracker from './pages/ContestTracker';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/contests" element={<ContestTracker />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Default redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all for 404 inside dashboard */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-4xl font-bold text-white mb-4">404</h2>
              <p className="text-[var(--color-dark-200)] mb-6">Page not found in this sector.</p>
              <button onClick={() => window.history.back()} className="btn-primary">Go Back</button>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
