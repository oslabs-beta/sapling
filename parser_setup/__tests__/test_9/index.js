import { prependOnceListener } from 'process';
import React from 'react';
import { render } from 'react-dom';

// Import React Components
import App from './components/App.jsx';

// TEST 9 - Simple React App with multiple Main components and different props passed in

render(
  <div>
    <App />
  </div>, document.getElementById('root')
  );