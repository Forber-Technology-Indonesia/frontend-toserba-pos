import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Dashboard from './Pages/Dashboard';
import AuthGoogle from './api/AuthGoogle';
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;



const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
console.log('==============C ID=====================');
console.log(CLIENT_ID);
console.log('====================================');
  const onSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Login Success: currentUser:', decoded);
    console.log('Google respond:', decoded);
    setIsLoggedIn(true);
    const userData= AuthGoogle(decoded);
    console.log('Backend Tospos respond:', userData);
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
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Google Sign-In</h1>
                    <GoogleLogin
                      onSuccess={onSuccess}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                      className="w-full flex justify-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
            <div className="absolute top-4 right-4">
              <button
                onClick={() => {
                  googleLogout();
                  onLogoutSuccess();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
