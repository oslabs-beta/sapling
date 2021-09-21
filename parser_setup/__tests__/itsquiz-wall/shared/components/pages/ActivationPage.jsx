import React, { PropTypes } from 'react';
import cx from 'classnames';

import { Card, CardTitle } from 'react-mdl/lib/Card';
import Grid, { Cell }      from 'react-mdl/lib/Grid';
import Button              from 'react-mdl/lib/Button';
import IconButton          from 'react-mdl/lib/IconButton';
import Spinner             from 'react-mdl/lib/Spinner';

import { sendEvent } from '../../utils/googleAnalytics';

import QuizTile             from '../QuizTile.jsx';
import Icon                 from '../Icon.jsx';
import ShareDialog          from '../../containers/ShareDialog.jsx';
import LoginDialog          from '../../containers/LoginDialog.jsx';
import AppBarWithBackground from '../AppBarWithBackground.jsx';
import ExpandableText       from '../ExpandableText.jsx';
import ScoreCircle          from '../other/ScoreCircle.jsx';
import Dialog               from '../Dialog.jsx';

import { sprintf } from '../../utils';

import './ActivationPage.less';

export default class ActivationPage extends React.Component {
    static propTypes = {
        activation                   : PropTypes.object,
        authorActivations            : PropTypes.arrayOf(PropTypes.object),
        similarActivations           : PropTypes.arrayOf(PropTypes.object),
        proposedActivations          : PropTypes.arrayOf(PropTypes.object),
        showAccountResult            : PropTypes.bool,
        isSurvey                     : PropTypes.bool,
        isAllAuthorActivationsLoaded : PropTypes.bool,
        sharingLink                  : PropTypes.string,
        accountQuizSession           : PropTypes.object,
        isLoading                    : PropTypes.bool,
        isLoggingIn                  : PropTypes.bool,
        isEmbedded                   : PropTypes.bool,
        isShowingProposedActivations : PropTypes.bool,
        isOrganization               : PropTypes.bool,
        isAvailable                  : PropTypes.bool,
        hideGoBackBtn                : PropTypes.bool,
        isLoadingAuthorActivations   : PropTypes.bool,
        dueTime                      : PropTypes.string,
        assessmentSystem             : PropTypes.array,
        onPass                       : PropTypes.func,
        onShare                      : PropTypes.func,
        onShareComplete              : PropTypes.func,
        onLoginDialogClose           : PropTypes.func,
        onStopSharing                : PropTypes.func,
        onGoBack                     : PropTypes.func,
        onShareResult                : PropTypes.func,
        onFillProfile                : PropTypes.func,
        onSponsoredClick             : PropTypes.func,
        onViewAnswers                : PropTypes.func,
        onActivationClick            : PropTypes.func,
        onLoadAllAuthorActivations   : PropTypes.func,
        onCloseMessageNotAvailable   : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    componentWillMount() {
        const { l } = this.context.i18n;

        this.sponsoredButtonLabel = Math.random() < 0.5 ? l('Contact me') : l('Get the gift');
    }

    handleActivationClick = (activation) => {
        this.props.onActivationClick(activation);
    };

    handlePassViaTelegram = () => {
        sendEvent('Activation Page', 'Pass via Telegram');
    };

    getGreeting = () => {
        const { l } = this.context.i18n;
        const { activation, assessmentSystem, isSurvey } = this.props;
        const score = activation.accountQuizSession.score;

        if (isSurvey) {
            return { phrase: l('Thank you for your answers!') };
        }

        if (assessmentSystem.length === 0) {
            if (score > 95) {
                return { phrase: l('You rock! Excellent job!') };
            }

            if (score > 75) {
                return { phrase: l('Great result!') };
            }

            if (score > 50) {
                return { phrase: l('Good job!') };
            }

            if (score > 30) {
                return { phrase: l('You could do better!') };
            }

            return { phrase: l('You could do better!') };
        }

        for (let i = assessmentSystem.length - 1; i >= 0; i--) {
            if (score >= assessmentSystem[i].grade) {
                return {
                    phrase: assessmentSystem[i].phrase,
                    description: assessmentSystem[i].description || ''
                };
            }
        }
    };

    renderStatisticsForSurvey = () => {
        const { activation } = this.props;
        const { l } = this.context.i18n;

        if (!activation.accountQuizSession) return null;

        return (
            <div className='ActivationPage__survey-statistics'>
                {sprintf(l('(%d of %d answered)'), activation.accountQuizSession.answeredQuestionsNumber,
                    activation.accountQuizSession.totalQuestionsNumber)}
            </div>
        );
    };

    renderProposedActivations = () => {
        if (!this.props.proposedActivations) {
            return;
        }

        return (
            <div
                className={`ActivationPage__proposed-activations--${
                    this.props.isShowingProposedActivations ? 'visible' : 'hidden'}`}
            >
                {
                    this.props.proposedActivations.map(proposedActivation =>
                        <div
                            className = 'ActivationPage__proposed-activation'
                            key       = {proposedActivation.id}
                        >
                            <QuizTile
                                id                = {proposedActivation.id}
                                name              = {proposedActivation.name}
                                timeToPass        = {proposedActivation.timeToPass}
                                numberOfQuestions = {proposedActivation.numberOfQuestions}
                                pictureURL        = {proposedActivation.pictureURL}
                                author            = {
                                    proposedActivation.author.fullName
                                    ?
                                        proposedActivation.author
                                    :
                                        this.props.activation.author
                                }
                                isPassed          = {Boolean(proposedActivation.isPassed)}
                                accountQuizSession   = {proposedActivation.accountQuizSession}
                                onClick           = {this.handleActivationClick.bind(null, proposedActivation)}
                            />
                        </div>
                    )
                }
            </div>
        );
    };

    renderAuthorActivations = () => {
        const {
            activation,
            authorActivations,
            isAllAuthorActivationsLoaded,
            isLoadingAuthorActivations,
            onLoadAllAuthorActivations
        } = this.props;

        const { l } = this.context.i18n;

        if (authorActivations && authorActivations.length) {
            return (
                <div className='ActivationPage__author-activations'>
                    <div className='ActivationPage__subheader'>
                        {sprintf(l('More tests by %s'), activation.author.fullName)}
                    </div>

                    <Grid className='ActivationPage__author-activations-grid'>
                        {
                            authorActivations.map(authorActivation =>
                                <Cell
                                    key    = {authorActivation.id}
                                    align  = 'stretch'
                                    col    = {3}
                                    phone  = {2}
                                    tablet = {3}
                                >
                                    <QuizTile
                                        id                = {authorActivation.id}
                                        name              = {authorActivation.name}
                                        timeToPass        = {authorActivation.timeToPass}
                                        numberOfQuestions = {authorActivation.numberOfQuestions}
                                        pictureURL        = {authorActivation.pictureURL}
                                        author            = {activation.author}
                                        isPassed          = {Boolean(authorActivation.isPassed)}
                                        accountQuizSession   = {authorActivation.accountQuizSession}
                                        onClick           = {this.handleActivationClick.bind(null, authorActivation)}
                                    />
                                </Cell>
                            )
                        }
                    </Grid>

                    {
                        isLoadingAuthorActivations
                        ?
                            <Spinner className='ActivationPage__author-activations-spinner' />
                        :
                            null
                    }

                    {
                        !isAllAuthorActivationsLoaded
                        ?
                            <Button ripple raised
                                className = 'ActivationPage__load-more-btn'
                                onClick   = {onLoadAllAuthorActivations}
                            >
                                {l('Load more')}
                            </Button>
                        :
                            null
                    }
                </div>
            );
        }

        return null;
    };

    renderSimilarActivations = () => {
        const {
            similarActivations
        } = this.props;

        const { l } = this.context.i18n;

        if (similarActivations && similarActivations.length) {
            return (
                <div className='ActivationPage__similar-activations'>
                    <div className='ActivationPage__subheader'>
                        {l('Similar tests')}
                    </div>

                    <Grid className='ActivationPage__similar-activations-grid'>
                        {
                            similarActivations.map(similarActivation =>
                                <Cell
                                    key    = {similarActivation.id}
                                    align  = 'stretch'
                                    col    = {3}
                                    phone  = {2}
                                    tablet = {3}
                                >
                                    <QuizTile
                                        id                = {similarActivation.id}
                                        name              = {similarActivation.name}
                                        timeToPass        = {similarActivation.timeToPass}
                                        numberOfQuestions = {similarActivation.numberOfQuestions}
                                        pictureURL        = {similarActivation.pictureURL}
                                        author            = {similarActivation.author}
                                        isPassed          = {similarActivation.isPassed}
                                        accountQuizSession   = {similarActivation.accountQuizSession}
                                        onClick           = {this.handleActivationClick.bind(null, similarActivation)}
                                    />
                                </Cell>
                            )
                        }
                    </Grid>
                </div>
            );
        }

        return null;
    };

    renderContent = () => {
        const {
            activation,
            isLoading,
            showAccountResult,
            isEmbedded,
            isSurvey,
            onPass,
            onShare,
            onShareResult,
            onFillProfile,
            onSponsoredClick,
            onViewAnswers
        } = this.props;

        const {
            id,
            pictureURL,
            name,
            isPrivate,
            canPassViaChat,
            accountQuizSession,
            numberOfQuestions,
            timeToPass,
            author,
            isSponsored,
            canAssigneePass,
            numberOfTriesLeft,
            dueTime,
            canAssigneeViewQuestions
        } = activation;

        const { l, nl, humanizeDuration, getTimeFromNow } = this.context.i18n;

        const isPassingBtnAvailable = isEmbedded ? canAssigneePass : true;

        const greeting = showAccountResult ? this.getGreeting().phrase : '';
        const greetingDescription = showAccountResult ? this.getGreeting().description : '';

        if (isLoading) {
            return <Spinner className='ActivationPage__spinner' />;
        }

        const classes = cx('ActivationPage__activation', {
            'ActivationPage__activation--sponsored': isSponsored,
            'ActivationPage__activation--passed': showAccountResult
        });

        const passInfoClasses = cx('ActivationPage__pass-info', { 'ActivationPage__pass-info--expires': dueTime });

        const settingsIconsClasses = cx('ActivationPage__settings-icons--indented', {
            'ActivationPage__settings-icons--on'  : canAssigneeViewQuestions,
            'ActivationPage__settings-icons--off' : !canAssigneeViewQuestions
        });

        const resultsContainerClasses = showAccountResult
            ? cx('ActivationPage__results-container', accountQuizSession.resultBackground, { 'survey' : isSurvey })
            : '';

        return (
            <div className={classes}>
                <Card className='ActivationPage__paper' shadow={1}>
                    <CardTitle className={
                        showAccountResult
                        ?
                            'ActivationPage__head--passed'
                        :
                            'ActivationPage__head'
                    }
                    >
                        <img className='ActivationPage__picture' src={pictureURL} />
                        <div className='ActivationPage__info'>
                            <div className='ActivationPage__heading'>
                                <span className='ActivationPage__name'>{name}</span>
                                {
                                    isPrivate
                                    ? <span className='ActivationPage__private-tag'>
                                        <Icon type='lock' className='ActivationPage__lock' />
                                        {l('private')}
                                    </span>
                                    : null
                                }
                            </div>

                            <div className='ActivationPage__author-name'>
                                {author.fullName}
                            </div>

                            <div className={passInfoClasses}>
                                <span className='ActivationPage__number-of-questions'>
                                    {
                                        sprintf(
                                            nl('%d question', '%d questions', numberOfQuestions),
                                            numberOfQuestions
                                        )
                                    }
                                </span>

                                <span className='ActivationPage__span-divider'>
                                    •
                                </span>

                                <span className='ActivationPage__time-to-pass'>
                                    {humanizeDuration(timeToPass, 'second')}
                                </span>

                                {
                                    dueTime
                                    ?   (
                                        <span className='ActivationPage__expires'>
                                            <span className='ActivationPage__span-divider'>
                                                •
                                            </span>
                                            <span>{sprintf(l('expires %s'), getTimeFromNow(dueTime))}</span>

                                        </span>
                                    )
                                    : null
                                }

                                <div className='ActivationPage__settings-icons'>
                                    <Icon
                                        title={canAssigneeViewQuestions
                                            ? l('You can view answers')
                                            : l('Author disallowed to view answers')}
                                        type='eye'
                                        size={16}
                                        className={settingsIconsClasses}
                                    />
                                    <Icon
                                        title={l('You can contact the author')}
                                        type='message'
                                        size={16}
                                    />
                                </div>
                            </div>
                            <div className='ActivationPage__actions'>
                                {
                                    showAccountResult && !isSurvey
                                    ?
                                        <Button
                                            ripple
                                            raised
                                            onClick   = {onShareResult.bind(null, activation)}
                                            className = 'ActivationPage__result-share-btn'
                                        >
                                            {l('Share result with friends')}
                                        </Button>
                                    :
                                        null
                                }

                                {
                                    !showAccountResult && isPassingBtnAvailable
                                    ?
                                        <div className='ActivationPage__pass-btn-wrapper'>
                                            <Button
                                                ripple
                                                raised    = {!isSponsored}
                                                onClick   = {onPass.bind(null, activation)}
                                                className = 'ActivationPage__btn ActivationPage__pass-btn'
                                            >
                                                {l('Pass the test')}
                                            </Button>
                                            {
                                                canPassViaChat
                                                ?
                                                    <a
                                                        className='ActivationPage__telegram-link'
                                                        href={`https://telegram.me/ItsQuizBot?start=${id}`}
                                                        target='_blank'
                                                        onClick={this.handlePassViaTelegram}
                                                    >
                                                        {l('pass via Telegram')}
                                                    </a>
                                                :
                                                    null
                                            }
                                            {
                                                numberOfTriesLeft
                                                ?
                                                    <div className='ActivationPage__number-of-tries'>
                                                        {
                                                            sprintf(
                                                                nl(
                                                                    'You have %d try left',
                                                                    'You have %d tries left',
                                                                    numberOfTriesLeft),
                                                                numberOfTriesLeft
                                                            )
                                                        }
                                                    </div>
                                                :
                                                    null
                                            }
                                        </div>
                                    :
                                        null
                                }

                                {
                                    isSponsored
                                    ? (
                                        <Button
                                            colored
                                            ripple
                                            raised
                                            onClick={onSponsoredClick.bind(null, activation, this.sponsoredButtonLabel)}
                                            className='ActivationPage__btn ActivationPage__offer-btn'
                                        >
                                            <Icon type='gift' />  {this.sponsoredButtonLabel}
                                        </Button>
                                    )
                                    : null
                                }
                            </div>
                        </div>

                        <div className='ActivationPage__menu'>
                            {
                                !activation.isPrivate && !isSurvey
                                ? (
                                    <IconButton
                                        ripple
                                        name    = 'share'
                                        onClick = {onShare.bind(null, activation)}
                                    />
                                )
                                : null
                            }
                        </div>
                    </CardTitle>

                    {
                        showAccountResult
                        ?
                            <div className={resultsContainerClasses}>
                                <div className='ActivationPage__overlay'>
                                    <div className='ActivationPage__menu--mobile'>
                                        {
                                            !activation.isPrivate && !isSurvey
                                            ? (
                                                <IconButton
                                                    ripple
                                                    name    = 'share'
                                                    onClick = {onShare.bind(null, activation)}
                                                />
                                            )
                                            : null
                                        }
                                    </div>
                                    <div className='ActivationPage__results-text'>

                                        {
                                            !isSurvey
                                            ?

                                                <div className='ActivationPage_score--circle'>
                                                    <ScoreCircle
                                                        value={accountQuizSession.score}
                                                        size ={200}
                                                    />
                                                </div>
                                            :
                                                null
                                        }

                                        {
                                            !isSurvey
                                            ?
                                                <div className='ActivationPage__points--mobile'>
                                                    ({
                                                        sprintf(
                                                            nl(
                                                                '%s of %s point',
                                                                '%s of %s points',
                                                                accountQuizSession.maxPoints
                                                            ),
                                                            accountQuizSession.gainedPoints,
                                                            accountQuizSession.maxPoints
                                                        )
                                                    })
                                                </div>
                                            :
                                                null
                                        }


                                        <h4 className='ActivationPage__greeting'>
                                            {greeting}
                                        </h4>

                                        {
                                            !isSurvey
                                            ?
                                                <Button
                                                    ripple
                                                    raised
                                                    onClick   = {onShareResult.bind(null, activation)}
                                                    className = 'ActivationPage__result-share-btn--mobile'
                                                >
                                                    {l('Share result')}
                                                </Button>
                                            :
                                                null
                                        }

                                        {
                                            !isSurvey
                                            ?
                                                <div className='ActivationPage__score'>
                                                    {accountQuizSession.score}%
                                                </div>
                                            :
                                                this.renderStatisticsForSurvey()
                                        }

                                        {
                                            !isSurvey
                                            ?
                                                <div className='ActivationPage__points'>
                                                    ({
                                                        sprintf(
                                                            nl(
                                                                '%s of %s point',
                                                                '%s of %s points',
                                                                accountQuizSession.maxPoints
                                                            ),
                                                            accountQuizSession.gainedPoints,
                                                            accountQuizSession.maxPoints
                                                        )
                                                    })
                                                </div>
                                            :
                                                null
                                        }

                                        {
                                            accountQuizSession.canViewAnswers
                                            ?
                                                <Button
                                                    ripple
                                                    onClick   = {onViewAnswers.bind(null, activation)}
                                                    className = 'ActivationPage__result-answers-btn--mobile'
                                                >
                                                    {l('View my answers')}
                                                </Button>
                                            : null
                                        }

                                        {
                                            isPassingBtnAvailable
                                            ? (
                                                <div className='ActivationPage__pass-btn-wrapper-passed--mobile'>
                                                    <Button
                                                        ripple
                                                        raised    = {!isSponsored}
                                                        onClick   = {onPass.bind(null, activation)}
                                                        className = 'ActivationPage__btn ActivationPage__pass-btn'
                                                    >
                                                        {
                                                            accountQuizSession.gainedPoints
                                                                === accountQuizSession.maxPoints
                                                            ?
                                                                l('Pass the test')
                                                            :
                                                                l('Improve result')
                                                        }
                                                    </Button>
                                                    {
                                                        canPassViaChat
                                                        ?
                                                            <a
                                                                className='ActivationPage__telegram-link'
                                                                href={`https://telegram.me/ItsQuizBot?start=${id}`}
                                                                target='_blank'
                                                            >
                                                                {l('pass via Telegram')}
                                                            </a>
                                                        :
                                                            null
                                                    }
                                                    {
                                                        numberOfTriesLeft
                                                        ?
                                                            <div className='ActivationPage__number-of-tries'>
                                                                {
                                                                    sprintf(
                                                                        nl(
                                                                            'You have %d try left',
                                                                            'You have %d tries left',
                                                                            numberOfTriesLeft),
                                                                        numberOfTriesLeft
                                                                    )
                                                                }
                                                            </div>
                                                        :
                                                            null
                                                    }
                                                </div>
                                            )
                                            : null
                                        }
                                    </div>

                                    <div className='ActivationPage__results-actions'>
                                        {
                                            isPassingBtnAvailable
                                            ? (
                                                <div className='ActivationPage__pass-btn-wrapper-passed'>
                                                    <Button
                                                        ripple
                                                        raised    = {!isSponsored}
                                                        onClick   = {onPass.bind(null, activation)}
                                                        className = 'ActivationPage__btn ActivationPage__pass-btn'
                                                    >
                                                        {
                                                            accountQuizSession.gainedPoints
                                                                === accountQuizSession.maxPoints
                                                            ?
                                                                l('Pass the test')
                                                            :
                                                                l('Improve result')
                                                        }
                                                    </Button>
                                                    {
                                                        canPassViaChat
                                                        ?
                                                            <a
                                                                className='ActivationPage__telegram-link'
                                                                href={`https://telegram.me/ItsQuizBot?start=${id}`}
                                                                target='_blank'
                                                            >
                                                                {l('pass via Telegram')}
                                                            </a>
                                                        :
                                                            null
                                                    }
                                                    {
                                                        numberOfTriesLeft
                                                        ?
                                                            <div className='ActivationPage__number-of-tries'>
                                                                {
                                                                    sprintf(
                                                                        nl(
                                                                            'You have %d try left',
                                                                            'You have %d tries left',
                                                                            numberOfTriesLeft),
                                                                        numberOfTriesLeft
                                                                    )
                                                                }
                                                            </div>
                                                        :
                                                            null
                                                    }
                                                </div>
                                            )
                                            : null
                                        }

                                        {
                                            accountQuizSession.canViewAnswers
                                            ?
                                                <Button
                                                    ripple
                                                    onClick   = {onViewAnswers.bind(null, activation)}
                                                    className = 'ActivationPage__result-answers-btn'
                                                >
                                                    {l('View my answers')}
                                                </Button>
                                            : null
                                        }

                                        {
                                            activation.category === 'VACANCY'
                                            ? <div>
                                                <Button
                                                    ripple
                                                    onClick   = {onFillProfile.bind(null, activation)}
                                                    className = 'ActivationPage__fill-profile-btn'
                                                >
                                                    {l('Fill in your resume')}
                                                </Button>
                                                <div className='ActivationPage__tip'>
                                                    {l('Filled profiles receive 70% more views')}
                                                </div>
                                            </div>
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                        : null
                    }

                    <div className='ActivationPage__details'>
                        <ExpandableText
                            isMarkdownEnabled
                            text={greetingDescription || activation.message}
                            markdownPreset='activationDescription'
                        />
                    </div>
                </Card>

                {this.renderSimilarActivations()}
                {this.renderAuthorActivations()}
            </div>
        );
    }

    render() {
        const { l } = this.context.i18n;
        const {
            activation,
            showAccountResult,
            sharingLink,
            isLoading,
            isLoggingIn,
            isEmbedded,
            isOrganization,
            isAvailable,
            onCloseMessageNotAvailable,
            hideGoBackBtn,
            onLoginDialogClose,
            onStopSharing,
            onGoBack
        } = this.props;

        const classes = cx('ActivationPage', {
            'ActivationPage--loading'  : isLoading,
            'ActivationPage--embedded' : isEmbedded
        });

        return (
            <div className={classes}>
                <ShareDialog
                    title          = {l('Share')}
                    isOpen         = {!!sharingLink}
                    twitterMessage = {
                        showAccountResult
                        ? sprintf(l('My result is %d%%'), activation.accountQuizSession.score)
                        : l('Check out this test')
                    }
                    onShare        = {this.props.onShareComplete}
                    linkToShare    = {sharingLink}
                    onRequestClose = {onStopSharing}
                />

                <LoginDialog
                    isOpen         = {isLoggingIn}
                    onRequestClose = {onLoginDialogClose}
                />

                <AppBarWithBackground
                    backgroundURL    = {activation.author ? activation.author.backgroundURL : ''}
                    displayRightMenu = {!isEmbedded}
                    rightIconName    = 'arrow_back'
                    title            = {activation.name}
                    height           = {200}
                    isOrganization   = {isOrganization}
                    hideGoBackBtn    = {hideGoBackBtn}
                    onRightIconClick = {onGoBack}
                />

                {
                    <Dialog
                        title=''
                        onRequestClose={onCloseMessageNotAvailable}
                        isOpen={!isAvailable}
                    >
                        <div
                            style={{
                                fontSize: '20px'
                            }}
                        >
                            {l('Unfortunately, this quiz is not available. Author will be informed.')}
                        </div>
                    </Dialog>
                }

                {this.renderProposedActivations()}

                <div className='ActivationPage__content'>
                    {this.renderContent()}
                </div>
            </div>
        );
    }
}
