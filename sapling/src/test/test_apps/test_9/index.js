import { prependOnceListener } from 'process';
import React from 'react';
import { render } from 'react-dom';

// Import React Components
import App from './components/App.jsx';

// TEST 9 - Prop Detection, one App Component renders two Main Components, each with different props

render(
  <div>
    <App />
  </div>, document.getElementById('root')
  );