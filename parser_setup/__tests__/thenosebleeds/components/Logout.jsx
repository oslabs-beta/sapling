import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

// Login Component
const Logout = ({ authUser, sendLogout }) => {
  // Logout user out when logout component renders:
  useEffect(() => {
    console.log('LOGOUT COMPONENT SIGNING OUT USER');
    sendLogout();
  }, []);

  if (authUser) {
    return <h1>Logging you out...</h1>;
  };

  return <Redirect to="/" />;
};

export default Logout;
