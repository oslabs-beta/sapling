import React from 'react';
import { Link, Redirect } from 'react-router-dom';

// Login Component
const Login = ({ authUser, updateLogin, loginForm, sendLogin }) => {
  // If authorised redirec to root
  if (authUser) {
    return <Redirect to="/" />;
  }

  // Otherwise display login page
  return (
  <div className="login-container">
    <h1>LOGIN HERE !</h1>
    <ul>

      {/* LOGIN EMAIL INPUT */}
      <li>
        <input
          type="text"
          id="login-email"
          size="20"
          placeholder="Email"
          required
          onChange={(e) => updateLogin('email', e.target.value)}
          // value={props.loginForm.email}
        />
      </li>

      {/* LOGIN PASSWORD INPUT */}
      <li>
        <input
          type="password"
          id="login-pass"
          size="20"
          placeholder="Password"
          required
          onChange={(e) => updateLogin('password', e.target.value)}
          // value={props.loginForm.password}
        />
      </li>
    </ul>

    {/* LOGIN BUTTON */}
    <button
      className="login-button"
      type="button"
      onClick={() => sendLogin(loginForm.email, loginForm.password)}
    >
      Log In
    </button>
    <p>
      No Account?
      <Link to="/login">Sign Up</Link>
    </p>
  </div>
  );
};

export default Login;
