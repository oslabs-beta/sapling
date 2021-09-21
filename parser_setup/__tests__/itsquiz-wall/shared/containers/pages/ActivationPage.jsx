import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import {
    loadActivation,
    loadSimilarActivations,
    loadAuthorActivations
} from '../../actions/activations';

import { loadAccountType } from '../../actions/accounts';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';
import EmbedEvents         from '../../utils/EmbedEventsUtil';
import config              from '../../config';
import { sendEvent }       from '../../utils/googleAnalytics';
import { makeSlug }        from '../../utils/urlUtil';

import ActivationPage from '../../components/pages/ActivationPage.jsx';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});


class ActivationPageContainer extends Component {
    static propTypes = {
        history                        : PropTypes.object,
        location                       : PropTypes.object,
        params                         : PropTypes.object,
        activation                     : PropTypes.object,
        customAssessmentSystem         : PropTypes.array,
        authorActivations              : PropTypes.array,
        similarActivations             : PropTypes.array,
        isLoading                      : PropTypes.bool,
        isLoadingAuthorActivations     : PropTypes.bool,
        isAllAuthorActivationsLoaded   : PropTypes.bool,
        isOrganization                 : PropTypes.bool,
        handleLoadAllAuthorActivations : PropTypes.func,
        dispatch                       : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    state = {
        proposedActivations          : [],
        sharingLink                  : '',
        isShowingProposedActivations : false,
        isLoggingIn                  : false,
        isAvailable                  : true
    };

    componentWillMount() {
        const { id, accountId } = this.props.params;

        if (accountId) {
            this.props.history.replaceState(null, `/activations/${id}`);
        }
    }

    componentDidMount() {
        const {
            activation,
            similarActivations,
            authorActivations
        } = this.props;

        this.generateProposedActivations({
            activation,
            similarActivations,
            authorActivations
        });

        this.timer = this.createTimer(10 * 1000);

        this.timer.start({
            activation,
            similarActivations,
            authorActivations
        });
    }

    componentWillReceiveProps(nextProps) {
        const {
            activation,
            similarActivations,
            authorActivations
        } = nextProps;

        if (this.props.isLoading && !nextProps.isLoading && nextProps.activation) {
            if (nextProps.activation.isSponsored) {
                sendEvent('sponsored activation', 'view', nextProps.activation.name);
            }
            sendEvent('activation', 'view', nextProps.activation.name);
        }

        if (activation.id !== this.props.activation.id) {
            this.generateProposedActivations({
                activation,
                similarActivations,
                authorActivations
            });

            this.timer.restart({
                activation,
                similarActivations,
                authorActivations
            });
        }
    }

    componentWillUnmount() {
        this.timer.stop();

        delete this.timer;
    }

    handlePassActivationClick = (activation) => {
        if (activation.passingsLeft === 0) {
            this.setState({
                isAvailable: false
            });

            return;
        }

        const isEmbedded = this.props.location.query.embed;
        const { actionId, isSponsored, name } = activation;

        if (isEmbedded) {
            embedEvents.send({
                type : 'PASS_TEST',
                actionId
            });
        } else {
            this.setState({ isLoggingIn: true });
        }

        if (isSponsored) {
            sendEvent('sponsored activation', 'pass', name);
        }
        sendEvent('activation', 'pass', name);
    };

    handleViewAnswers = (activation) => {
        const isEmbedded = this.props.location.query.embed;

        if (isEmbedded && activation.isPassed) {
            const quizSessionId = activation.accountQuizSession.id;

            embedEvents.send({
                type : 'VIEW_ANSWERS',
                quizSessionId
            });
        }

        sendEvent('activation', 'view answers', activation.name);
    };

    handleFillProfile = (activation) => {
        const isEmbedded = this.props.location.query.embed;

        if (isEmbedded && activation.isPassed) {
            embedEvents.send({
                type : 'FILL_PROFILE'
            });
        }

        sendEvent('activation', 'fill profile click', activation.name);
    };

    handleSponsoredClick = (activation, buttonLabelForResearch) => {
        const isEmbedded = this.props.location.query.embed;
        const { id } = activation;

        if (isEmbedded) {
            embedEvents.send({
                type         : 'COURSE_REQUEST',
                activationId : id
            });
        } else {
            this.setState({ isLoggingIn: true });
            this.props.history.pushState(null, this.props.location.pathname, {
                requestActivationId: id
            });
        }

        sendEvent('sponsored activation', 'request', activation.name);

        // We conduct research which button label works better
        sendEvent('sponsored request button', 'click', buttonLabelForResearch);
    };

    handleGoBack = () => {
        window.history.back();
    };

    handleActivationClick = (activation) => {
        this.props.history.pushState(null, `/activations/${activation.id}/${makeSlug(activation.name)}`, {
            embed      : this.props.location.query.embed,
            assigneeId : this.props.location.query.assigneeId
        });

        sendEvent('activation', 'author activation view');
    };

    handleShare = (activation) => {
        this.setState({
            sharingLink : activation.publicLink
        });

        sendEvent('activation', 'share', 'click');
    };

    handleShareResult = (activation) => {
        this.setState({
            sharingLink : activation.accountQuizSession.shareResultLink
        });

        sendEvent('activation', 'share result', activation.name);
    };

    handleShareComplete = (activation, { socialNetwork }) => {
        embedEvents.send({
            type : 'SHARE_RESULT',
            activationId: activation.id,
            socialNetwork
        });
    };

    handleStopSharing = () => {
        this.setState({
            sharingLink : ''
        });
    };

    handleLoginClose = () => {
        this.setState({
            isLoggingIn : false
        });
    };

    handleCloseMessageNotAvailable = () => {
        this.setState({
            isAvailable: true
        });
    };

    handleLoadAllAuthorActivations = () => {
        this.props.dispatch(loadAuthorActivations({ isAllActivationsLoaded: true }));
    };

    getRandomInteger = (min, max) => {
        return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    };

    getRandomNumbers = (min, max, amount) => {
        if (amount < 1) {
            return;
        }

        const result = [];

        while (result.length !== amount) {
            const randomNumber = this.getRandomInteger(min, max - 1);

            if (result.indexOf(randomNumber) !== -1) {
                continue;
            }

            result.push(randomNumber);
        }

        return result;
    };

    generateProposedActivations = ({ activation, similarActivations, authorActivations }) => {
        if (!activation || !activation.accountQuizSession || !similarActivations || !authorActivations
            || similarActivations.length + authorActivations.length === 0) {
            this.hideProposedActivations();

            return;
        }

        const amount = 2;

        let candidatesForPropose = similarActivations.length >= amount
            ? similarActivations
            : similarActivations.concat(authorActivations);

        candidatesForPropose = candidatesForPropose.filter(item => !item.accountQuizSession);

        if (candidatesForPropose.length === 0) {
            return;
        }

        if (candidatesForPropose.length === 1) {
            this.setState({
                proposedActivations: this.state.proposedActivations || candidatesForPropose,
                isShowingProposedActivations : false
            });

            this.showProposedActivations(candidatesForPropose);

            return;
        }

        const proposedActivationsIndexes = this.getRandomNumbers(0, candidatesForPropose.length, amount);

        const proposedActivations = proposedActivationsIndexes.map(index => candidatesForPropose[index]);

        this.setState({
            proposedActivations: this.state.proposedActivations || proposedActivations,
            isShowingProposedActivations : false
        });

        this.showProposedActivations(proposedActivations);
    };

    showProposedActivations = (proposedActivations) => {
        setTimeout(() => {
            this.setState({
                proposedActivations,
                isShowingProposedActivations: true
            });
        }, 500);
    }

    hideProposedActivations = () => {
        this.setState({
            isShowingProposedActivations: false
        });

        setTimeout(() => {
            this.setState({
                proposedActivations: []
            });
        }, 500);
    }

    createTimer = (period) => {
        const self = this;

        return {
            start(data) {
                this.interval = setInterval(self.generateProposedActivations.bind(self, data), period);
            },
            restart(data) {
                this.stop();
                this.start(data);
            },
            stop() {
                clearInterval(this.interval);
            }
        };
    }

    isArraysEqual(array1, array2) {
        return array1.sort().join() === array2.sort().join();
    }

    render() {
        const {
            activation,
            authorActivations,
            similarActivations,
            isLoading,
            customAssessmentSystem,
            isOrganization,
            isAllAuthorActivationsLoaded,
            isLoadingAuthorActivations
        } = this.props;

        const {
            sharingLink,
            proposedActivations,
            isLoggingIn,
            isShowingProposedActivations,
            isAvailable
        } = this.state;

        const { embed, assigneeId, hideLeftMenu } = this.props.location.query;

        const isSurvey = activation.accountQuizSession ? Boolean(activation.accountQuizSession.maxPoints === 0) : false;

        return (
            <ActivationPage
                activation                   = {activation}
                authorActivations            = {authorActivations}
                similarActivations           = {similarActivations}
                sharingLink                  = {sharingLink}
                isLoading                    = {isLoading}
                isLoadingAuthorActivations   = {isLoadingAuthorActivations}
                isEmbedded                   = {Boolean(embed)}
                hideGoBackBtn                = {Boolean(hideLeftMenu)}
                isLoggingIn                  = {isLoggingIn}
                showAccountResult            = {Boolean(activation.isPassed && assigneeId)}
                assessmentSystem             = {customAssessmentSystem}
                proposedActivations          = {proposedActivations}
                isSurvey                     = {isSurvey}
                isShowingProposedActivations = {isShowingProposedActivations}
                isOrganization               = {isOrganization}
                isAvailable                  = {isAvailable}
                isAllAuthorActivationsLoaded = {isAllAuthorActivationsLoaded}
                onPass                       = {this.handlePassActivationClick}
                onSponsoredClick             = {this.handleSponsoredClick}
                onSubscribe                  = {this.handleSubscribeClick}
                onViewAnswers                = {this.handleViewAnswers}
                onFillProfile                = {this.handleFillProfile}
                onActivationClick            = {this.handleActivationClick}
                onGoBack                     = {this.handleGoBack}
                onShare                      = {this.handleShare}
                onShareResult                = {this.handleShareResult}
                onShareComplete              = {this.handleShareComplete.bind(this, activation)}
                onStopSharing                = {this.handleStopSharing}
                onLoginDialogClose           = {this.handleLoginClose}
                onCloseMessageNotAvailable   = {this.handleCloseMessageNotAvailable}
                onLoadAllAuthorActivations   = {this.handleLoadAllAuthorActivations}
            />
        );
    }
}

function mapStateToProps({
    currentActivation : {
        activation,
        authorActivations,
        similarActivations,
        isLoadingActivation,
        isLoadingAuthorActivations,
        isAllAuthorActivationsLoaded
    },
    currentAssessmentSystem : { assessmentSystem },
    currentAccount          : { isOrganization }
}) {
    return {
        isOrganization,
        activation,
        authorActivations,
        similarActivations,
        isAllAuthorActivationsLoaded,
        isLoadingAuthorActivations,
        isLoading: isLoadingActivation,
        customAssessmentSystem: assessmentSystem
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(ActivationPageContainer, [loadActivation, loadSimilarActivations, loadAccountType])
);
