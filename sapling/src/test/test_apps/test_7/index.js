import React from 'react';
import { render } from 'react-dom';

import App from './components/App.jsx'

// TEST 7 - Invalid Javascript could crash babel parser

render(
  <div>
    <App />
  </div>, document.getElementById('root'));
