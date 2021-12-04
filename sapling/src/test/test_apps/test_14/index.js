import React from 'react';
import { render } from 'react-dom';

import App from './components/App.jsx'

// TEST 14 - Tests following:
// 1. Variable Declaration
  // 1) Array Destructuring
  // const [foo, bar] = import('module');
  // 2) Object Destructuring + Aliasing
  // const { foo: bar } = import('module');
// 2. Import Declaration: Namespace Specifier
  // import * as foo from "mod.js";
  // 1) export * from 'module'; (where module is a file)
  // 2) multiple exports statements within module
  // 3) single export default statement

render(
  <div>
    <App />
  </div>, document.getElementById('root'));
