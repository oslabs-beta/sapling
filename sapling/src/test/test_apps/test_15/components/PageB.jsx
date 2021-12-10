import React, { Component } from 'react';

class PageB1 extends Component {
  render() {
    return (
      <section>
        <div>I am PageB1.</div>
      </section>
    );
  }
}

class PageB2 extends Component {
  render() {
    return (
      <section>
        <div>I am PageB2.</div>
      </section>
    );
  }
}

module.exports = [PageB1, PageB2];
