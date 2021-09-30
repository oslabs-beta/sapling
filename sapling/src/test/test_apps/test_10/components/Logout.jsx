import React from 'react';
import { Redirect } from 'react-router-dom';

// React component that fakes logging out and returns user to login page
const Logout = ({ setUserInfo }) => {
  setUserInfo({ name: '', email: '' });

  return <Redirect to="/login" />;
};

export default Logout;
