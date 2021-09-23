import React, { Component, PropTypes } from 'react';
import cx                            from 'classnames';

import Icon       from 'react-mdl/lib/Icon';
import Textfield  from 'react-mdl/lib/Textfield';

import './SearchBox.less';

const ENTER_KEY = 13;

export default class SearchBox extends Component {
    static propTypes = {
        search   : PropTypes.string,
        onSearch : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    state = {
        isFocused: false
    };

    handleKeyDown = (e) => {
        if (e.keyCode === ENTER_KEY) {
            this.props.onSearch(e.target.value);
        }
    };

    handleSearchChange = (e) => {
        const value = e.target.value;

        if (!value) {
            this.props.onSearch(value);
        }
    };

    handleBoxClick = () => {
        this._input.focus();
    };

    handleFocus = () => {
        this.setState({
            isFocused: true
        });
    };

    handleBlur = () => {
        this.setState({
            isFocused: false
        });
    };

    render() {
        const { search } = this.props;
        const { l } = this.context.i18n;

        const rootClassNames = cx('SearchBox', {
            'SearchBox--focused' : this.state.isFocused
        });

        return (
            <div className={rootClassNames}>
                <div
                    className='SearchBox__box'
                    onClick={this.handleBoxClick}
                >
                    <Icon name='search' className='SearchBox__search-icon' />

                    <input
                        className    = 'SearchBox__input'
                        type         = 'text'
                        ref          = {ref => this._input = ref}
                        placeholder  = {l('Search')}
                        defaultValue = {search}
                        onChange     = {this.handleSearchChange}
                        onKeyDown    = {this.handleKeyDown}
                        onFocus      = {this.handleFocus}
                        onBlur       = {this.handleBlur}
                    />
                </div>

                <Textfield
                    expandable
                    className      = 'SearchBox__input-expandable'
                    type           = 'text'
                    placeholder    = {l('Search')}
                    label          = {'ololo'}
                    defaultValue   = {search}
                    expandableIcon = 'search'
                    onChange       = {this.handleSearchChange}
                    onKeyDown      = {this.handleKeyDown}
                    onFocus        = {this.handleFocus}
                    onBlur         = {this.handleBlur}
                />
            </div>
        );
    }
}
