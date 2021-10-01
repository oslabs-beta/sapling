import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Import Redux Related:
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

// Import React Components
import NavBar from './NavBar.jsx';
import Watchlist from './Watchlist.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Main from './Main.jsx';

const mapStateToProps = ({ users }) => ({
  loginForm: users.loginForm,
  signupForm: users.signupForm,
  authUser: users.authUser,
  username: users.username,
  useremail: users.useremail,
  watchlist: users.watchlist,
});

const mapDispatchToProps = (dispatch) => ({
  updateLogin: (field, value) => {
    dispatch(actions.updateLoginActionCreator(field, value));
  },
  sendLogin: (email, password) => {
    dispatch(actions.sendLoginActionCreator(email, password));
  },
  updateSignup: (field, value) => {
    dispatch(actions.updateSignupActionCreator(field, value));
  },
  sendSignup: (username, email, password) => {
    dispatch(actions.sendSignupActionCreator(username, email, password));
  },
  sendLogout: () => {
    dispatch(actions.sendLogoutActionCreator());
  },
});

// App Component
const App = ({
  authUser,
  username,
  useremail,
  updateSignup,
  signupForm,
  sendSignup,
  updateLogin,
  loginForm,
  sendLogin,
  sendLogout,
  watchlist
}) => (
  <div>
    <NavBar
      authUser={authUser}
      username={username}
      useremail={useremail}
    />

    {/* React Router Switches */}
    <Switch>
      <Route path="/watchlist">
        <Watchlist watchlist={watchlist} />
      </Route>
      <Route path="/signup">
        <Signup
          authUser={authUser}
          updateSignup={updateSignup}
          signupForm={signupForm}
          sendSignup={sendSignup}
        />
      </Route>
      <Route path="/login">
        <Login
          authUser={authUser}
          updateLogin={updateLogin}
          loginForm={loginForm}
          sendLogin={sendLogin}
        />
      </Route>
      <Route path="/logout">
        <Logout
          authUser={authUser}
          sendLogout={sendLogout}
        />
      </Route>
      <Route path="/">
        <Main authUser={authUser} />
      </Route>
    </Switch>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
