import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Mock protected component
const Dashboard = () => <h2>Dashboard: Protected Route</h2>;

// Protected Route Component
const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const onSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Login Success: currentUser:', decoded);
    setIsLoggedIn(true);
    setUserData(decoded);
  };

  const onLogoutSuccess = () => {
    console.log('Logout made successfully');
    setIsLoggedIn(false);
    setUserData({});
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <div>
                    <h1>Google Sign-In Demo</h1>
                    <GoogleLogin
                      onSuccess={onSuccess}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                    />
                  </div>
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          {isLoggedIn && (
            <button
              onClick={() => {
                googleLogout();
                onLogoutSuccess();
              }}
            >
              Logout
            </button>
          )}
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
