import { prependOnceListener } from 'process';
import React from 'react';
import { render } from 'react-dom';

// Import React Components
import App from './components/App.jsx';

// TEST 0 - Simple React App with one App Component

render(
  <div>
    <App />
  </div>, document.getElementById('root')
  );