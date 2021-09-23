import React from 'react';

export default class Provider extends React.Component {
    static propTypes = {
        i18n     : React.PropTypes.object.isRequired,
        children : React.PropTypes.object.isRequired
    };

    static childContextTypes = { i18n: React.PropTypes.object };

    getChildContext() {
        return { i18n: this.props.i18n };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
