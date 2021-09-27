import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// Import styles from SASS
import styles from './scss/application.scss';

// Import React Components
import App from './components/App.jsx';

// TEST 3 - Multi component application including react-router components

render(
  <Router children={App} />,
  document.getElementById('root'),
);
