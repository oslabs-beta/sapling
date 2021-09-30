import React from 'react';
import { render } from 'react-dom';
import { Switch as S, Route as R } from 'react-router-dom';

import JS from './components/JS';
import JSX from './components/JSX';
import TS from './components/TS';
import TSX from './components/TSX';

// TEST 5 - No file extensions for js, jsx, ts, tsx files. Switch, Route are never used

render(
  <div>
    <JS />
    <JSX />
    <TS />
    <TSX />
  </div>, document.getElementById('root'));
