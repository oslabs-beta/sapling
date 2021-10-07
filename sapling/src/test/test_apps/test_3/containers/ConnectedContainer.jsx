import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

const mapStateToProps = state => {
  return {
    count: state.fake.count,
  }
}

const mapDispatchToProps = dispatch => ({
  fakeAction1: () => dispatch(actions.FAKE_ACTION_1()),
  fakeAction2: () => dispatch(actions.FAKE_ACTION_2()),
})

class ConnectedContainer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
      return (
        <p>This is a container connected to the redux Store</p>
      )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedContainer);
