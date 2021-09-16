import React from 'react';
import { render } from 'react-dom';
import { Switch, Route } from 'react-router-dom';


render(
  <div>
    <Switch >
      <Route component={App}>
      </Route>
    </Switch>
  </div>, document.getElementById('root'));
