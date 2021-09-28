import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

// Import styles from SASS / BootStrap
import bootstrap from 'bootstrap';
import styles from './styles/application.scss';

// Import React Components
import App from './components/App.jsx';

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
