import React from 'react';
import { render } from 'react-dom';

// Import React Components
import App from './components/App.jsx';

// TEST 1 - Simple App with two components, App and Main, App renders Main

render(
  <div>
    <App />
  </div>, document.getElementById('root')
  );
