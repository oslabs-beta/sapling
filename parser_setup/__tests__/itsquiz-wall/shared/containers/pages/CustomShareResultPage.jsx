import React, { Component, PropTypes } from 'react';
import strformat                       from 'strformat';

import BasicSharePage from '../../components/pages/BasicSharePage.jsx';

import { customShareInfo } from '../../config';
import { sendEvent }       from '../../utils/googleAnalytics';

class CustomShareResultPageContainer extends Component {
    static propTypes = {
        history           : PropTypes.object,
        location          : PropTypes.object,
        params            : PropTypes.object
    };

    componentDidMount() {
        const { key } = this.props.params;

        sendEvent('custom share result', 'direct open', key);

        if (customShareInfo && customShareInfo[key] && customShareInfo[key].redirectRoute) {
            this.props.history.replaceState(null, customShareInfo[key].redirectRoute, {
                ...this.props.location.query
            });
        } else {
            this.props.history.replaceState(null, '/activations', {
                ...this.props.location.query
            });
        }
    }

    render() {
        const { key } = this.props.params;

        const shareInfo = customShareInfo && customShareInfo[key] ? customShareInfo[key] : {};

        const { query } = this.props.location;

        return (
            <BasicSharePage
                title   = {shareInfo.title ? strformat(shareInfo.title, query) : ''}
                text    = {shareInfo.description ? strformat(shareInfo.description, query) : ''}
                picture = {shareInfo.pictureURL}
            />
        );
    }
}

export default CustomShareResultPageContainer;
