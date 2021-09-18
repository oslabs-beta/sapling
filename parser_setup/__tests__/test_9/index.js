import { prependOnceListener } from 'process';
import React from 'react';
import { render } from 'react-dom';

// Import React Components
import App from './components/App.jsx';

// TEST 8 - Simple React App with two App Components and one prop

render(
  <div>
    <App />
  </div>, document.getElementById('root')
  );