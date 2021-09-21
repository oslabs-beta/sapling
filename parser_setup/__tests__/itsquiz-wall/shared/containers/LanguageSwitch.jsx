import React, { Component, PropTypes } from 'react';
import cookie from 'cookie';

import { getSupportedLocales } from '../utils';
import { sendEvent }           from '../utils/googleAnalytics';

import LanguageSwitch from '../components/LanguageSwitch.jsx';

const SUPPORTED_LOCALES = getSupportedLocales();

export default class LanguageSwitchContainer extends Component {
    static contextTypes = { i18n: PropTypes.object };

    handleSelectLanguage = (newLocale) => {
        document.cookie = cookie.serialize('locale', newLocale, { path: '/', maxAge: 900000 });

        sendEvent('language', 'change', newLocale);
        window.location.reload();
    };

    render() {
        const { getLocale } = this.context.i18n;

        return (
            <LanguageSwitch
                languages={SUPPORTED_LOCALES}
                selectedLanguage={getLocale()}
                onSelect={this.handleSelectLanguage}
            />
        );
    }
}
