import React from 'react';
import { Redirect, Link } from 'react-router-dom';

// Login Component
const Signup = ({ authUser, updateSignup, signupForm, sendSignup }) => {
  // If authorised redirect to root
  if (authUser) {
    return <Redirect to="/" />;
  }

  // Otherwise display signup page
  return (
    <div className="signup-container">
      <h1>Create an Account:</h1>
      <ul>
        <li>
          Email:
          <input
            type="email"
            id="signup-email"
            required
            onChange={(e) => updateSignup('email', e.target.value)}
          />
        </li>
        <li>
          Display Name:
          <input
            type="text"
            id="signup-username"
            required
            onChange={(e) => updateSignup('username', e.target.value)}
          />
        </li>
        <li>
          Password:
          <input
            type="password"
            id="signup-pass"
            size="20"
            required
            onChange={(e) => updateSignup('password', e.target.value)}
          />
        </li>
      </ul>
      <button
        className="signup-button"
        type="button"
        onClick={() => {
          sendSignup(signupForm.email, signupForm.username, signupForm.password);
        }}
      >
        Signup
      </button>
      <p>
        Already have an account?
        <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
