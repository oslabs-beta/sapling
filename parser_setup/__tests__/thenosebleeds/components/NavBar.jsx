import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ authUser, username, useremail }) => {
  console.log('NAVBAR RENDERED');

  // Conditional navbar links depending on authentication:
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        {/* {NAVBAR BRAND} */}
        <Link to="/">
          <button type="button" className="navbar-brand">
            nosebleeds
          </button>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* {NAVBAR LEFT} */}
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {authUser
              ? (
                <li className="nav-item">
                  <Link to="/watchlist" className="nav-link"> Watchlist</Link>
                </li>
              )
              : null}
          </ul>

          {/* {NAVBAR RIGHT} */}

          {authUser
            ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <span className="nav-link">Logged in as {username}</span>
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="nav-link">Logout</Link>
                </li>
              </ul>
            )
            : (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Signup</Link>
                </li>
              </ul>
            )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
