import React, { Component, PropTypes } from 'react';

import PromoPage from '../../components/pages/PromoPage.jsx';

import { promos } from '../../config';

class PromoPageContainer extends Component {
    static propTypes = {
        history           : PropTypes.object,
        location          : PropTypes.object,
        params            : PropTypes.object
    };

    getMarkdownSource() {
        const { key } = this.props.params;

        switch (key) {
            case 'iforum-2016': {
                const text = require('./PromoPage/iforum-2016.js');

                return text;
            }

            default: {
                return 'No such promo';
            }
        }
    }

    render() {
        const { key } = this.props.params;

        const promoInfo = promos && promos[key] ? promos[key] : {};

        return (
            <PromoPage
                text    = {this.getMarkdownSource()}
                picture = {promoInfo.image}
            />
        );
    }
}

export default PromoPageContainer;
