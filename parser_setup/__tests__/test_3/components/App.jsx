import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Import React Components
import Nav from './Nav.jsx';
import ExercisesDisplay from './ExercisesDisplay.jsx';
import ExerciseCreator from './ExerciseCreator.jsx';
import DrillCreator from './DrillCreator.jsx';
import HistoryDisplay from './HistoryDisplay.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';

// App Component
const App = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  return (
    <div className="App">
      <Nav userInfo={userInfo} />

      {/* React Router Switches */}
      <Switch>
        <Route path="/drill/:id">
          <DrillCreator />
        </Route>
        <Route path="/history">
          <HistoryDisplay />
        </Route>
        <Route path="/ExerciseCreator">
          <ExerciseCreator />
        </Route>
        <Route path="/login">
          <Login setUserInfo={setUserInfo} />
        </Route>
        <Route path="/logout">
          <Logout setUserInfo={setUserInfo} />
        </Route>
        <Route path="/signup">
          <Signup setUserInfo={setUserInfo} />
        </Route>
        <Route path="/">
          <ExercisesDisplay />
        </Route>

      </Switch>

      {/* If not logged in force redirect to login page */}
      {!userInfo.name ? <Redirect to="/login" /> : null}

    </div>
  );
};

export default App;
