import React from 'react';
import { render } from 'react-dom';

import App1 from './components/App1.jsx'

// TEST 11 - Recursive import of App1 and App2

render(
  <div>
    <App1 />
  </div>, document.getElementById('root'));
