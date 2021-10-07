import React, { Component } from 'react';

class UnconnectedContainer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        <p>This is a container not connected to the Redux store.</p>
    }
}

export default UnconnectedContainer;