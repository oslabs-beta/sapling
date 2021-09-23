import React, { Component, PropTypes } from 'react';
import strformat                       from 'strformat';

import Footer from '../components/Footer.jsx';

import { footerLinks, quizwallShareLink } from '../config';

import { sendEvent } from '../utils/googleAnalytics';

export default class FooterContainer extends Component {
    static contextTypes = { i18n: PropTypes.object };

    state = {
        showShareDialog: false
    };

    componentWillMount() {
        const { getLocale } = this.context.i18n;

        this.links = {};

        for (const linkType in footerLinks) {
            if ({}.hasOwnProperty.call(footerLinks, linkType)) {
                this.links[linkType] = strformat(footerLinks[linkType], {
                    lang: getLocale()
                });
            }
        }

        this.linkToShare = quizwallShareLink;
    }

    handleLinkClick = (type) => {
        sendEvent('footer', 'click', type);
    };

    handleShare = () => {
        this.setState({ showShareDialog: true });
        sendEvent('footer', 'share');
    };

    handleShareClose = () => {
        this.setState({ showShareDialog: false });
    };

    openLinkInPopup = (URL) => {
        window.open(URL, '', 'width=500, height=500');
    };

    openLinkInNewTab = (URL) => {
        window.open(URL, '_blank');
    };

    render() {
        return (
            <Footer
                links={this.links}
                showShareDialog={this.state.showShareDialog}
                linkToShare={this.linkToShare}
                onLinkClick={this.handleLinkClick}
                onShareClick={this.handleShare}
                onShareClose={this.handleShareClose}
            />
        );
    }
}
