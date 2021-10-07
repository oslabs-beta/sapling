import React from 'react';
import { render } from 'react-dom';
import { Switch, Route } from 'react-router-dom';
import Tippy from 'tippy';

// TEST 2 - Third Party Components, Destructuring Import

render(
  <div>
    <Switch >
      <Route component={App}>
      </Route>
      <Tippy />
    </Switch>
  </div>, document.getElementById('root'));
