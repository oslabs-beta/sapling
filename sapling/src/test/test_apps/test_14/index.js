import React from 'react';
import { render } from 'react-dom';

import App from './components/App.jsx';

// TEST 15 - Tests following:
// require statements
// 1) Array Destructuring
// const [foo, bar] = require('module');
// 2) Object Destructuring + Aliasing
// const { foo: bar } = require('module');

render(
  <div>
    <App />
  </div>,
  document.getElementById('root')
);
