import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import { loadActivations } from '../../actions/activations';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';
import EmbedEvents         from '../../utils/EmbedEventsUtil';
import config              from '../../config';
import { sendEvent }       from '../../utils/googleAnalytics';
import { makeSlug }        from '../../utils/urlUtil';

import ActivationsPage from '../../components/pages/ActivationsPage.jsx';

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

class ActivationsPageContainer extends Component {
    static propTypes = {
        history   : PropTypes.object,
        dispatch  : PropTypes.func,
        location  : PropTypes.object,
        params    : PropTypes.object,

        totalActivationsAmount : PropTypes.number,
        search                 : PropTypes.string,
        category               : PropTypes.string,
        sortType               : PropTypes.string,
        activations            : PropTypes.array,
        isLoading              : PropTypes.bool
    };

    static contextTypes = { i18n: PropTypes.object };

    state = {
        linkToShare : '',
        isSharing   : false,
        isLoggingIn : false
    };

    componentDidMount() {
        embedEvents.subscribe({
            'SEARCH_QUIZ_WALL' : this.handleSearch
        });
    }

    componentWillUnmount() {
        embedEvents.unsubscribe();
    }

    handleQuizCardClick = (activation) => {
        this.props.history.pushState(null, `/activations/${activation.id}/${makeSlug(activation.name)}`, {
            embed : this.props.location.query.embed,
            assigneeId : this.props.location.query.assigneeId
        });

        sendEvent('activation card', 'view details', activation.name);
    };

    handleSearch = (searchText) => {
        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            search : searchText || undefined
        });

        sendEvent('activations page', 'search');
    };

    handleShare = (activation) => {
        this.setState({
            linkToShare : activation.publicLink,
            isSharing   : true
        });

        sendEvent('activation card', 'share', activation.name);
    };

    handleChangeSortType = (e) => {
        const newSortType = e.target.value;

        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            sortType : newSortType
        });
    };

    handleSpecialsSubscribe = () => {
        this.setState({
            isLoggingIn : true
        });

        sendEvent('specials subscribe', 'click');

        if (!localStorage.getItem('ref')) {
            localStorage.setItem('ref', 'new_offers');
        }
    };

    handleLoginClose = () => {
        this.setState({
            isLoggingIn : false
        });
    };

    handleTabChange = (category) => {
        this.props.history.pushState(null, this.props.location.pathname, {
            ...this.props.location.query,
            category : category !== 'ALL' ? category : undefined
        });

        sendEvent('activations page', 'category change', category);
    };

    handleStopSharing = () => {
        this.setState({
            linkToShare : '',
            isSharing   : false
        });
    };

    handleItemRenderRequest = (index) => {
        const { activations, totalActivationsAmount } = this.props;

        if (index + 1 < totalActivationsAmount && index + 1 >= activations.length) {
            this.props.dispatch(loadActivations({
                params : this.props.params,
                query  : this.props.location.query,
                offset : activations.length
            }));
        }
    };

    handleAuthorAvatarClick = (authorId) => {
        const isEmbedded = this.props.location.query.embed;

        if (isEmbedded) {
            embedEvents.send({
                authorId,
                type : 'VIEW_AUTHOR_PROFILE'
            });
        } else {
            this.setState({ isLoggingIn: true });
        }
    };

    render() {
        return (
            <ActivationsPage
                activations            = {this.props.activations}
                totalActivationsAmount = {this.props.totalActivationsAmount}
                search                 = {this.props.search}
                linkToShare            = {this.state.linkToShare}
                sortType               = {this.props.sortType}
                selectedCategory       = {this.props.category}
                isSharing              = {this.state.isSharing}
                isLoggingIn            = {this.state.isLoggingIn}
                isEmbedded             = {Boolean(this.props.location.query.embed)}
                isLoading              = {this.props.isLoading}
                isEmpty                = {this.props.activations.length === 0}
                onItemClick            = {this.handleQuizCardClick}
                onSearch               = {this.handleSearch}
                onShare                = {this.handleShare}
                onLoginClose           = {this.handleLoginClose}
                onSpecialsSubscribe    = {this.handleSpecialsSubscribe}
                onTabChange            = {this.handleTabChange}
                onItemRenderRequest    = {this.handleItemRenderRequest}
                onChangeSortType       = {this.handleChangeSortType}
                onStopSharing          = {this.handleStopSharing}
                onAuthorAvatarClick    = {this.handleAuthorAvatarClick}
            />
        );
    }
}

function mapStateToProps({ activations }) {
    const { entitiesByCategory, sortType, search, category, isLoading, totalActivationsAmount } = activations;

    return {
        totalActivationsAmount,
        isLoading,
        search,
        category,
        sortType: sortType || 'new',
        activations: entitiesByCategory[category] || []
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(ActivationsPageContainer, [ loadActivations ])
);
