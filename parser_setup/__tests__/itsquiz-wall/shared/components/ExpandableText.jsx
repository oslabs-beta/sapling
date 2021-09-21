import React, { Component, PropTypes } from 'react';

import cx from 'classnames';

import Button   from 'react-mdl/lib/Button';
import Markdown from './Markdown.jsx';

import './ExpandableText.less';

const MAX_CHAR_NUMBER = 300;

export default class ExpandableText extends Component {
    static propTypes = {
        text              : PropTypes.string,
        markdownPreset    : PropTypes.string,
        isMarkdownEnabled : PropTypes.bool
    };

    static contextTypes = { i18n: React.PropTypes.object };

    state = {
        expanded: false
    };

    handleClick = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    renderedText = () => {
        const { text, markdownPreset, isMarkdownEnabled } = this.props;

        return isMarkdownEnabled
            ? <Markdown preset={markdownPreset} source={text} />
            : <p>{text}</p>;
    }

    render() {
        const { l } = this.context.i18n;

        const { text, markdownPreset } = this.props;

        const classes = cx('ExpandableText__text', {
            'minimized': !this.state.expanded
        });

        return (
            <div className='ExpandableText'>
                {
                    text.length > MAX_CHAR_NUMBER
                    ?
                        <div>
                            <div className={classes}>
                                <Markdown preset={markdownPreset} source={text} />
                            </div>
                            <Button
                                colored
                                ripple
                                className = 'ExpandableText__expand-button'
                                onClick   = {this.handleClick}
                            >
                                {
                                    this.state.expanded
                                    ?
                                        l('Minimize')
                                    :
                                        l('Expand')
                                }
                            </Button>
                        </div>
                    :
                        <div className='ExpandableText__text'>
                            <Markdown preset={markdownPreset} source={text} />
                        </div>
                }
            </div>
        );
    }
}
