import React from 'react';
import { render } from 'react-dom';

import App from './components/App.jsx';

// TEST 15 - Tests following:
// Variable declaration import statements
// 1) Array Destructuring
// const [foo, bar] = import('module');
// 2) Object Destructuring + Aliasing
// const { foo: bar } = import('module');

render(
  <div>
    <App />
  </div>,
  document.getElementById('root')
);
