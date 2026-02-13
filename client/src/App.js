/**
 * Main App Component
 * 
 * Handles routing and layout for the application
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
