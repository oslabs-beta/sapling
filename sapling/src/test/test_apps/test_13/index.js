import React from 'react';
import { render } from 'react-dom';

import App from './components/App.jsx'

// TEST 11 - Recursive import of App1 and App2

render(
  <div>
    <App />
  </div>, document.getElementById('root'));
