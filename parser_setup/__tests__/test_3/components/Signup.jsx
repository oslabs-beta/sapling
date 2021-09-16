import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';

// React component to render signup form and send form data to server
const Signup = ({ setUserInfo }) => {
  const [formVals, setFormVals] = useState({ email: '', name: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to update state formVals on form change
  const updateFormVal = (key, val) => {
    setFormVals({ ...formVals, [key]: val });
  };

  // Function to submit signup form data to server, create new account
  const signup = () => {
    console.log('signing up!', formVals);
    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formVals),
    })
      .then((response) => {
        // If signup successful, login
        console.log('SIGNUP RESPONSE: ', response.status);
        if (response.status === 201 || 400) {
          return response.json();
        }
        throw new Error('Error when trying to create new user!');
      })
      .then((data) => {
        if (data.message) {
          setErrorMessage(data.message);
          return;
        }
        setUserInfo(data);
        setLoggedIn(true);
      })
      .catch((err) => console.error(err));
  };

  const { email, name, password } = formVals;

  // If signed up correctly, redirect to main page
  if (loggedIn) {
    return <Redirect to="/" />;
  }

  // If not logged in render signup form
  if (!loggedIn) {
    return (
      <section>
        <h3>Signup to WobbeGainz:</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup();
          }}
        >
          {/* EMAIL INPUT */}
          <label htmlFor="newUserEmail">Email Address:</label>
          <input
            id="newUserEmail"
            type="email"
            placeholder="Email Address"
            onChange={(e) => {
              console.log('Updated state: ', e.target.value);
              updateFormVal('email', e.target.value);
            }}
            value={email}
            name="email"
            required
          />

          {/* NAME INPUT */}
          <label htmlFor="newUserName">Display Name:</label>
          <input
            id="newUserName"
            type="text"
            placeholder="Display Name"
            onChange={(e) => {
              console.log('Updated state: ', e.target.value);
              updateFormVal('name', e.target.value);
            }}
            value={name}
            name="display name"
            required
          />

          {/* PASSWORD INPUT */}
          <label htmlFor="newUserPassword">Password:</label>
          <input
            id="newUserPassword"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              console.log('Updated state: ', e.target.value);
              updateFormVal('password', e.target.value);
            }}
            value={password}
            name="password"
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        {/* SIGNUP ERROR MESSAGE */}
        {errorMessage ? (
          <p>
            Error:
            {` ${errorMessage}`}
          </p>
        )
          : null}
        <p>
          Already Have an Acccount?
          <Link to="/login">
            Log In
          </Link>
        </p>
      </section>
    );
  }
};

export default Signup;
