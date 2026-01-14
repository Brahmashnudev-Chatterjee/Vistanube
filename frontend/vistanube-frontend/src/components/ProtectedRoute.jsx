// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
    const { user, token } = useAuth();

    if (!token) {
        // 1. If no token, redirect to login
        return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && user?.role !== requiredRole) {
        // 2. If token exists but role is wrong (e.g., Creator trying to access Feed)
        // You might redirect to the correct dashboard or a 403 page
        if (user.role === 'creator') {
            return <Navigate to="/creator" replace />;
        }
        return <Navigate to="/" replace />; // Fallback to home/login
    }

    // 3. User is logged in and has the correct role
    return children;
}

export default ProtectedRoute;