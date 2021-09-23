import React from 'react';
import { render } from 'react-dom';
import { Switch as S, Route as R } from 'react-router-dom';

// TEST 4 - Third Party Components, Destructuring Import and Aliasing

render(
  <div>
    <S >
      <R />
    </S>
  </div>, document.getElementById('root'));
