import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  console.log("client ID");
  console.log("==>" + CLIENT_ID);


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
      <div className="App">
        <h1>Google Sign-In Demo</h1>
        {isLoggedIn ? (
          <div>
            <h2>Welcome {userData.name}</h2>
            <img src={userData.picture} alt="Profile" />
            <button onClick={() => {
              googleLogout();
              onLogoutSuccess();
            }}>Logout</button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
