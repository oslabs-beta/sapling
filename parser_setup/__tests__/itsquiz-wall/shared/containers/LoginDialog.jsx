import React, { Component, PropTypes } from 'react';
import strformat                       from 'strformat';
import escapeHTML                      from 'lodash/string/escape';

import LoginDialog from '../components/LoginDialog.jsx';

import { socialAuthURL, emailAuthURL } from '../config';

import { sendEvent } from '../utils/googleAnalytics';

export default class LoginDialogContainer extends Component {
    static propTypes = {
        isOpen         : PropTypes.bool.isRequired,
        onRequestClose : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    componentWillReceiveProps(nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            sendEvent('login dialog', 'view');
        }
    }

    handleSocialLogin = (type) => {
        const { getLocale } = this.context.i18n;

        sendEvent('login dialog', 'login', type);

        const redirectURL = strformat(socialAuthURL, {
            lang: getLocale().toUpperCase(),
            continueRoute: escapeHTML(`/quizwall${window.location.pathname + window.location.search}`),
            socialType: type,
            ref: localStorage.getItem('ref') || ''
        });

        this.openLink(redirectURL);
    };

    handleEmailLogin = () => {
        const { getLocale } = this.context.i18n;

        sendEvent('login dialog', 'login', 'email');

        const redirectURL = strformat(emailAuthURL, {
            lang: getLocale().toLowerCase(),
            continueRoute: escapeHTML(`/quizwall${window.location.pathname + window.location.search}`),
            ref: localStorage.getItem('ref') || ''
        });

        this.openLink(redirectURL);
    };

    openLink = (URL) => {
        window.open(URL, '_self');
    };

    render() {
        const { isOpen, onRequestClose } = this.props;

        return (
            <LoginDialog
                isOpen         = {isOpen}
                onSocialLogin  = {this.handleSocialLogin}
                onEmailLogin   = {this.handleEmailLogin}
                onRequestClose = {onRequestClose}
            />
        );
    }
}
