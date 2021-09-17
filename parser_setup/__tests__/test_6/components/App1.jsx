import React, { Component } from 'react';
import App2 from './App2.jsx'

class App1 extends Component {
  render () {
    return (
      <section>
        <div>I am App 1.</div>
        <App2 />
      </section>
    )
  }
}

export default App1;
