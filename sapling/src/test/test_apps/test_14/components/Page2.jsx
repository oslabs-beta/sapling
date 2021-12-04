import React, { Component } from 'react';

class Page1of2 extends Component {
  render () {
    return (
      <section>
        <div>I am Page1of2.</div>
      </section>
    )
  }
}

class Page2of2 extends Component {
  render () {
    return (
      <section>
        <div>I am Page2of2.</div>
      </section>
    )
  }
}

export default [ Page1of2, Page2of2 ];
