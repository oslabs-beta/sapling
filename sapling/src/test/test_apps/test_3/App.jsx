import React, { Component } from 'react';
import ConnectedContainer from './containers/ConnectedContainer'
import UnconnectedContainer from './containers/UnconnectedContainer'


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          <ConnectedContainer />
          <UnconnectedContainer />
      </div>
    );
  }
}

export default App;
