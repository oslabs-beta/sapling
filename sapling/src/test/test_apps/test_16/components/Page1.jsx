import React, { Component } from 'react';
import Child1 from './Child1';

class Page1 extends Component {
  render() {
    return (
      <section>
        <div>This is Page 1</div>
        <Child1 />
      </section>
    );
  }
}

export default Page1;
