import React, { Component, PropTypes } from 'react';

import AppBar from './AppBar.jsx';

import './AppBarWithBackground.less';

export default class AppBarWithBackground extends Component {
    static propTypes = {
        backgroundURL : PropTypes.string,
        height        : PropTypes.number,
        onLogin       : PropTypes.func,
        isOrganization: PropTypes.bool
    };

    static defaultProps = {
        backgroundURL : '',
        height        : 0
    };

    render() {
        const { backgroundURL, height, onLogin, isOrganization } = this.props;

        const appBarStyle = {
            background: `url(${backgroundURL}) center / cover`
        };

        return (
            <div className='AppBarWithBackground' style={appBarStyle}>
                <AppBar
                    className='AppBarWithBackground__fixed'
                    displaySearch={false}
                    scrollOffset={height / 2}
                    onLogin={onLogin}
                    isOrganization={isOrganization}
                    {...this.props}
                />
            </div>
        );
    }
}
