import React, { Component, PropTypes } from 'react';

import ShareDialog from '../containers/ShareDialog.jsx';

import './Footer.less';

export default class Footer extends Component {
    static propTypes = {
        links           : PropTypes.object,
        linkToShare     : PropTypes.string,
        showShareDialog : PropTypes.bool,
        onLinkClick     : PropTypes.func,
        onShareClick    : PropTypes.func,
        onShareClose    : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    render() {
        const { l } = this.context.i18n;

        const { links, linkToShare, showShareDialog, onLinkClick, onShareClick, onShareClose } = this.props;

        return (
            <div className='Footer'>
                <ShareDialog
                    title = {l('Share this page')}
                    isOpen = {showShareDialog}
                    linkToShare = {linkToShare}
                    onRequestClose = {onShareClose}
                />
                <div className='Footer__content'>
                    <div className='Footer__menus-container'>
                        <div className='Footer__menu'>
                            <h3 className='Footer__menu-header'>{l('Keep in touch')}</h3>
                            <ul className='Footer__menu-items'>
                                <li>
                                    <a  rel='nofollow'
                                        href={links.twitter}
                                        target='_blank'
                                        onClick={onLinkClick.bind(null, 'twitter')}
                                    >
                                        {l('Twitter')}
                                    </a>
                                </li>
                                <li>
                                    <a  rel='nofollow'
                                        href={links.facebook}
                                        target='_blank'
                                        onClick={onLinkClick.bind(null, 'facebook')}
                                    >
                                        {l('Facebook')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        rel='nofollow'
                                        href={links.youtube}
                                        target='_blank'
                                        onClick={onLinkClick.bind(null, 'youtube')}
                                    >
                                        {l('Videos on Youtube')}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className='Footer__menu'>
                            <h3 className='Footer__menu-header'>{l('Support')}</h3>
                            <ul className='Footer__menu-items'>
                                <li>
                                    <a
                                        rel='nofollow'
                                        href={links.supportPage}
                                        target='_blank'
                                        onClick={onLinkClick.bind(null, 'supportPage')}
                                    >
                                        {l('Support page')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        rel='nofollow'
                                        href={links.suggestIdea}
                                        target='_blank'
                                        onClick={onLinkClick.bind(null, 'suggestIdea')}
                                    >
                                        {l('Suggest an idea')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        rel='nofollow'
                                        href={links.helpMe}
                                        target='_blank'
                                        onClick={onLinkClick.bind(null, 'helpMe')}
                                    >
                                        {l('Need help?')}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className='Footer__menu'>
                            <h3 className='Footer__menu-header'>{l('Do you like It\'s quiz?')}</h3>
                            <ul className='Footer__menu-items'>
                                <li>
                                    <a
                                        href={links.aboutItsquiz}
                                        target='_blank'
                                        onClick={onLinkClick.bind(null, 'aboutItsquiz')}
                                    >
                                        {l('About testing platform')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={links.ourTeam}
                                        target='_blank'
                                        onClick={onLinkClick.bind(null, 'ourTeam')}
                                    >
                                        {l('Meet our team')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={onShareClick}
                                    >
                                        {l('Share this page')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
