import React from 'react';
import { render } from 'react-dom';

import App from './App.jsx';

// TEST 16 - Barrel Files
// index.js, index.ts files that contain "export * from './file'" statements.
// and enable folders to be used as modules
// e.g. import { file } from './dir'

render(
  <div>
    <App />
  </div>,
  document.getElementById('root')
);
