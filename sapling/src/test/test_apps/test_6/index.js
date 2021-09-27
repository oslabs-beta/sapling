import React from 'react';
import { render } from 'react-dom';

import App1 from './components/App1.jsx'

// TEST 6 - Bad import of App2 from App1 Component

render(
  <div>
    <App1 />
  </div>, document.getElementById('root'));
