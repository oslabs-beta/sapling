import React, { Component, PropTypes } from 'react';
import cx                              from 'classnames';

import IconButton                       from 'react-mdl/lib/IconButton';
import { Card, CardTitle, CardActions } from 'react-mdl/lib/Card';
import Button                           from 'react-mdl/lib/Button';

import { makeSlug } from '../utils/urlUtil';
import { sprintf }  from '../utils';

import MdiIcon from './Icon.jsx';

import './QuizCard.less';

export default class QuizCard extends Component {
    static propTypes = {
        id                  : PropTypes.string,
        name                : PropTypes.string,
        message             : PropTypes.string,
        timeToPass          : PropTypes.number,
        numberOfQuestions   : PropTypes.number,
        pictureURL          : PropTypes.string,
        author              : PropTypes.object,
        isSponsored         : PropTypes.bool,
        isSurvey            : PropTypes.bool,
        className           : PropTypes.string,
        category            : PropTypes.string,
        isPassed            : PropTypes.bool,
        accountQuizSession     : PropTypes.object,
        onShare             : PropTypes.func,
        onAuthorAvatarClick : PropTypes.func,
        onClick             : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick();
    };

    getCategoryLabel = (category) => {
        const { l } = this.context.i18n;

        const categoryLabels = {
            'EDUCATION': l('Education'),
            'ENTERTAINMENT': l('Entertainment'),
            'VACANCY': l('Vacancy')
        };

        return categoryLabels[category];
    };

    render() {
        const {
            id,
            name,
            message,
            className,
            category,
            timeToPass,
            numberOfQuestions,
            pictureURL,
            author,
            isSponsored,
            isPassed,
            isSurvey,
            accountQuizSession,
            onClick,
            onShare,
            onAuthorAvatarClick
        } = this.props;

        const { l, nl, humanizeDuration } = this.context.i18n;

        const classes = cx('QuizCard', className, {
            'QuizCard--sponsored': isSponsored
        });

        const classesForActionBlock = cx('QuizCard__actions', {
            'QuizCard__actions--survey': isSurvey
        });

        return (
            <Card shadow={1} className={classes}>
                <CardTitle className='QuizCard__head'>
                    <div className='QuizCard__info'>
                        <img
                            className='QuizCard__avatar'
                            src={author.smallAvatarUrl}
                            onClick={onAuthorAvatarClick.bind(null, author.id)}
                        />
                        <div className='QuizCard__name-author'>
                            <a
                                href={`/activations/${id}/${makeSlug(name)}`}
                                className='QuizCard__name'
                                onClick={this.handleClick}
                                title={name}
                            >
                                {name}
                            </a>

                            <div className='QuizCard__author' title={author.fullName}>
                                {author.fullName}
                            </div>
                        </div>
                    </div>
                </CardTitle>

                <div
                    className='QuizCard__media'
                    onClick={onClick}
                    style={{ background: `url(${pictureURL}) center / cover` }}
                >
                    {
                        isPassed
                        ? <div className='QuizCard__overlay'>
                            {
                                !isSurvey
                                ?
                                    <span className='QuizCard__account-score'>
                                        {accountQuizSession.score}%
                                    </span>
                                :
                                    <MdiIcon type='check' className='QuizCard__survey--passed' />
                            }
                        </div>
                        : null
                    }

                    <div className='QuizCard__category'>
                        {this.getCategoryLabel(category)}
                    </div>
                </div>

                <div className='QuizCard__content'>
                    {
                        isSponsored
                        ? <div className='QuizCard__special' onClick = {onClick}>
                            <MdiIcon type='gift' /> {l('Special proposition!')}
                        </div>
                        : <div className='QuizCard__details'>
                            <span>
                                {
                                    sprintf(
                                        nl('%d question', '%d questions', numberOfQuestions),
                                        numberOfQuestions
                                    )
                                }
                            </span>
                            <span className='QuizCard__span-divider'>•</span>
                            <span>{humanizeDuration(timeToPass, 'second')}</span>
                        </div>
                    }

                    <p className='QuizCard__text'> {message} </p>
                </div>

                <CardActions
                    border
                    className={classesForActionBlock}
                >
                    {
                        !isSurvey
                        ?
                            <div>
                                <IconButton
                                    colored
                                    className = 'QuizCard__share-button'
                                    name      = 'share'
                                    onClick   = {onShare}
                                />
                            </div>
                        :
                            null
                    }

                    <Button
                        colored
                        ripple
                        className = 'QuizCard__more-button'
                        raised    = {isSponsored}
                        onClick   = {onClick}
                    >
                        {l('View details')}
                    </Button>
                </CardActions>
            </Card>
        );
    }
}
