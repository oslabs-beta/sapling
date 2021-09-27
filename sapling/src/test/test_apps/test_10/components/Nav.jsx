import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ userInfo }) => {
  console.log('this is the navbar speaking', userInfo);

  // Navbar when not signed in:
  if (!userInfo.name) {
    return (
      <nav>
            <Link class="link" to="/login">Login</Link>
            <Link class="link" to="/signup">Signup</Link>
      </nav>
    );
  }

  // Signed in Navbar:
  return (
    <nav>
          <Link class="link" to="/">Home</Link>
          <Link class="link" to="/ExerciseCreator">Create Exercise</Link>
          <Link class="link" to="/history">History</Link>
          <Link class="link" to="/logout">Logout</Link>
          <p>
            {userInfo.name
              ? (
                <h4>
                  Logged in as:
                  {userInfo.name}
                  -
                  {userInfo.email}
                </h4>
              )
              : null}
          </p>
    </nav>
  );
};

export default Nav;
