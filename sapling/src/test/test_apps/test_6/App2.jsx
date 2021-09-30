import React, { Component } from 'react';
import App1 from './App1.jsx'

class App2 extends Component {
  render () {
    return (
      <section>
        <div>I am App 1.</div>
        <App1 />
      </section>
    )
  }
}

export default App2;
