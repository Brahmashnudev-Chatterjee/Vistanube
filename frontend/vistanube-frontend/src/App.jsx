import { BrowserRouter, Routes, Route, Navigate,Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatorDashboard from "./pages/CreatorDashboard";
import ConsumerFeed from "./pages/ConsumerFeed"; // <-- IMPORT THE NEW CONSUMER FEED PAGE

/* ---------- Route Guards / Protection Logic ---------- */

// 🔑 1. Generic Protected Route: Checks if ANY user is logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    // If no user object (not logged in), redirect to login
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, allow access
  return children;
};


// 🔑 2. Role-Specific Route: Checks for a specific role AND handles misdirection
const RoleRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // If not logged in, the outer ProtectedRoute will handle the redirect. 
  // We only run this logic if we KNOW 'user' exists.
  if (user) {
    if (user.role === requiredRole) {
      return children; // Correct role, grant access
    } else {
      // Incorrect role (e.g., Creator trying to access /feed)
      // Redirect to the role's correct dashboard
      const correctPath = user.role === "creator" ? "/creator" : "/feed";
      return <Navigate to={correctPath} replace />;
    }
  }
  
  // This should be unreachable if the route is nested in ProtectedRoute, 
  // but acts as a fallback to ensure login is checked first.
  return <Navigate to="/login" replace />; 
};


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔑 PROTECTED ROUTES GROUP */}
          <Route 
            path="/" 
            element={<ProtectedRoute><Outlet /></ProtectedRoute>} // Use a wrapping element
          >
            
            {/* 🔑 PROTECTED CREATOR ROUTE */}
            <Route
              path="creator"
              element={
                <RoleRoute requiredRole="creator">
                  <CreatorDashboard />
                </RoleRoute>
              }
            />
            
            {/* 🔑 PROTECTED CONSUMER FEED ROUTE (THE FIX!) */}
            <Route
              path="feed"
              element={
                <RoleRoute requiredRole="consumer">
                  <ConsumerFeed />
                </RoleRoute>
              }
            />

            {/* Fallback for logged-in users who land on a non-defined protected route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          
          {/* Fallback for unauthenticated users */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;