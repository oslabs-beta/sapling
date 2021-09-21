import React, { Component, PropTypes } from 'react';

import { Card, CardTitle, CardActions } from 'react-mdl/lib/Card';

import { makeSlug } from '../utils/urlUtil';

import MdiIcon from './Icon.jsx';

import './QuizTile.less';

export default class QuizTile extends Component {
    static propTypes = {
        id                : PropTypes.string,
        name              : PropTypes.string,
        message           : PropTypes.string,
        pictureURL        : PropTypes.string,
        author            : PropTypes.object,
        accountQuizSession   : PropTypes.object,
        isPassed          : PropTypes.bool,
        onClick           : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick();
    };

    render() {
        const {
            id,
            name,
            pictureURL,
            author,
            accountQuizSession,
            isPassed,
            onClick
        } = this.props;

        const isSurvey = accountQuizSession ? accountQuizSession.maxPoints === 0 : false;

        return (
            <Card className='QuizTile' shadow={1}>
                <CardTitle
                    className='QuizTile__title'
                >
                    <img src={pictureURL} width='100%' onClick={onClick} />
                    {
                        isPassed
                        ? <div className='QuizTile__overlay' onClick={onClick}>
                            {
                                !isSurvey
                                ?
                                    <span className='QuizTile__account-score'>
                                        {accountQuizSession.score}%
                                    </span>
                                :
                                    <MdiIcon type='check' className='QuizTile__survey--passed' />
                            }
                        </div>
                        : null
                    }
                </CardTitle>

                <CardActions className='QuizTile__text'>
                    <a
                        href={`/activations/${id}/${makeSlug(name)}`}
                        title={name}
                        className='QuizTile__name'
                        onClick={this.handleClick}
                    >
                        {name}
                    </a>

                    <div className='QuizTile__author'>
                        {author.fullName}
                    </div>
                </CardActions>
            </Card>
        );
    }
}
