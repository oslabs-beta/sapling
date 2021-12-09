import React from 'react';
import { render } from 'react-dom';

import App from './components/App.jsx'

// TEST 14 - Tests following:
// Variable Declaration
  // 1) Array Destructuring
  // const [foo, bar] = import('module');
  // 2) Object Destructuring + Aliasing
  // const { foo: bar } = import('module');

render(
  <div>
    <App />
  </div>, document.getElementById('root'));
