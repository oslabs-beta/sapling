import React from 'react';
import { render } from 'react-dom';
import { Switch, Route } from 'react-router-dom';

// TEST 2 - Third Party Components, Destructuring Import

render(
  <div>
    <Switch >
      <Route component={App}>
      </Route>
    </Switch>
  </div>, document.getElementById('root'));
