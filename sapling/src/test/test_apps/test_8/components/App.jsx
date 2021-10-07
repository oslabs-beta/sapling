import React, { Component } from 'react';
import Main from './Main';



class App extends Component {
  render () {
    return (
      <div>
        <Main prop1={'This is a prop'} prop2={'This is another prop'} prop3={'One more prop'}/>
      </div>
    )
  }
}

export default App;
