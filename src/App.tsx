import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UsersList from './components/UsersList';

// Protected Route Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" />;
};

// Public Route Component (redirects to /users if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return !token ? <>{children}</> : <Navigate to="/users" />;
};

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/users"
            element={
              <PrivateRoute>
                <UsersList />
              </PrivateRoute>
            }
          />
          {/* Redirect any unknown routes to the appropriate page based on auth status */}
          <Route
            path="*"
            element={
              <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;