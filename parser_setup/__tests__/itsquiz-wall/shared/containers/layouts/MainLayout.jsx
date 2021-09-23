/* eslint react/no-did-mount-set-state: 0 */

import React, { Component, PropTypes } from 'react';

import MainLayout from '../../components/layouts/MainLayout.jsx';

import { sendEvent }   from '../../utils/googleAnalytics';

export default class MainLayoutContainer extends Component {
    static propTypes = {
        history   : PropTypes.object,
        dispatch  : PropTypes.func,
        location  : PropTypes.object,
        params    : PropTypes.object,
        children  : PropTypes.object
    };

    state = {
        isWelcomeScreenShown: false
    };

    componentDidMount() {
        const skipWelcomeScreen = localStorage.getItem('skipWelcomeScreen');
        const { skipWelcomeDialog, ref } = this.props.location.query;

        if (!skipWelcomeScreen && !skipWelcomeDialog) {
            this.setState({ isWelcomeScreenShown: true });
        }

        if (ref && !localStorage.getItem('ref')) {
            localStorage.setItem('ref', ref);
            sendEvent('initial', 'ref', ref);
        }
    }

    handleWelcomeScreenDismiss = (needToSkip) => {
        this.setState({ isWelcomeScreenShown: false });

        if (needToSkip) {
            localStorage.setItem('skipWelcomeScreen', 'true');
        }
    };

    render() {
        const { isWelcomeScreenShown } = this.state;

        const { location, children } = this.props;

        const isEmbedded = location.query.embed;

        return (
            <MainLayout
                showWelcomeScreen={!isEmbedded && isWelcomeScreenShown}
                onWelcomeScreenDismiss={this.handleWelcomeScreenDismiss}
                showFooter={!isEmbedded}
            >
                {children}
            </MainLayout>
        );
    }
}
