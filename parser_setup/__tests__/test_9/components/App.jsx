import React, { Component } from 'react';
import Main from './Main';

const string = 'This is a variable string'

class App extends Component {
  render () {
    return (
      <div>
        <Main prop1='This is a string prop' />
        <Main prop2={string} />
        <Main prop3={ 1 + 1 } />
      </div>
    )
  }
}

export default App;
