import React, { Component, PropTypes } from 'react';

import ShareDialog from '../components/ShareDialog.jsx';
import { facebookAppId } from '../config';

// import { getLocale } from '../i18n/Tools';
import { sendEvent } from '../utils/googleAnalytics';

export default class ShareDialogContainer extends Component {
    static propTypes = {
        title          : PropTypes.string,
        isOpen         : PropTypes.bool.isRequired,
        twitterMessage : PropTypes.string,
        linkToShare    : PropTypes.string.isRequired,
        onRequestClose : PropTypes.func,
        onShare        : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    static defaultProps = {
        twitterMessage : ''
    };

    handleShare = (type) => {
        const { getLocale } = this.context.i18n;
        const { twitterMessage } = this.props;
        let { linkToShare } = this.props;

        const currentLocale = getLocale() !== 'tr' ? getLocale() : 'en';
        const date = +new Date();

        // Date parameter is added here to create unique link (resolves facebook cashing problem)
        linkToShare += `?locale=${currentLocale}&date=${date}`;

        const linksHash = {
            'google': `https://plus.google.com/share?url=${linkToShare}`,
            'facebook': `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&display=popup`
                + `&href=${linkToShare}&redirect_uri=${linkToShare}`,
            'twitter': `https://twitter.com/intent/tweet?text=${encodeURI(twitterMessage)}&url=${linkToShare}&via=itsquizcom`,
            'linkedin': `https://www.linkedin.com/shareArticle?mini=true&url=${linkToShare}`,
            'vk': `http://vk.com/share.php?url=${linkToShare}`
        };

        this.openLinkInPopup(linksHash[type]);

        if (this.props.onShare) {
            this.props.onShare({
                sharedLink: linksHash[type],
                socialNetwork: type
            });
        }

        sendEvent('activation', 'share', type);
    };

    openLinkInPopup = (URL) => {
        window.open(URL, '', 'width=500, height=500');
    };

    render() {
        const { title, isOpen, onRequestClose } = this.props;

        return (
            <ShareDialog
                title          = {title}
                isOpen         = {isOpen}
                onShare        = {this.handleShare}
                onRequestClose = {onRequestClose}
            />
        );
    }
}
