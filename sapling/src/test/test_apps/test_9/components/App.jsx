import React, { Component } from 'react';
import Main from './Main';



class App extends Component {
  render () {
    return (
      <div>
        <Main prop1={'This is a prop'}/>
        <Main prop2={'This is a second, different prop'}/>
      </div>
    )
  }
}

export default App;
