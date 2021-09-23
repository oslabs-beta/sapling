import React, { Component, PropTypes } from 'react';
import cx                              from 'classnames';

import './LanguageSwitch.less';

export default class LanguageSwitch extends Component {
    static propTypes = {
        languages        : PropTypes.arrayOf(PropTypes.string),
        selectedLanguage : PropTypes.string,
        className        : PropTypes.func,
        onSelect         : PropTypes.func.isRequired
    };

    handleSelectValueChange = (e) => {
        this.props.onSelect(e.target.value);
    };

    render() {
        const { className, selectedLanguage, languages } = this.props;

        const classes = cx('LanguageSwitch__select', className);

        return (
            <div className='LanguageSwitch'>
                <select
                    className={classes}
                    defaultValue={selectedLanguage}
                    onChange={this.handleSelectValueChange}
                >
                    {
                        languages.map(lang =>
                            <option key={lang} value={lang} className='LanguageSwitch__option'>
                                {lang.toUpperCase()}
                            </option>
                        )
                    }
                </select>
            </div>
        );
    }
}
