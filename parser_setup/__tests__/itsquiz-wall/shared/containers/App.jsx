import React, { Component, PropTypes } from 'react';

import EmbedEvents              from '../utils/EmbedEventsUtil';
import config                   from '../config';
import { initialize, navigate } from '../utils/googleAnalytics';
import isIOSDevice              from '../utils/isIOSDevice';

if (process.env.BROWSER) {
    require('../assets');
}

const TIMER_DELAY = 1000;

const embedEvents = new EmbedEvents({
    embedOrigin: config.embedOrigin
});

export default class App extends Component {
    static propTypes = {
        location : PropTypes.object,
        routes   : PropTypes.array,
        children : PropTypes.object,
        history  : PropTypes.object
    };

    componentWillMount() {
        this.appContainerHeight = 0;

        clearInterval(this.iframeHeightCalcTimer);
    }

    componentDidMount() {
        initialize();
        const routes = this.props.routes;

        navigate({
            page  : this.props.location.pathname,
            title : routes[routes.length - 1].path
        });

        embedEvents.subscribe({
            'REDIRECT_QUIZ_WALL' : this.handleRedirect
        });

        if (isIOSDevice()) {
            this.appContainerHeight = this.getContainerHeight();

            this.sendIframeHeightEvent(this.appContainerHeight);
        }
    }

    componentWillReceiveProps(nextProps) {
        const currentLocation = this.props.location;
        const nextLocation = nextProps.location;

        const isEmbed = Boolean(currentLocation.query.embed);

        const isPathnameChanged = currentLocation.pathname !== nextLocation.pathname;
        const isQueryChanged = currentLocation.query !== nextLocation.query;

        if (isPathnameChanged) {
            navigate({
                page  : nextLocation.pathname,
                title : nextProps.routes[nextProps.routes.length - 1].path
            });

            this.sendIframeHeightEvent();
        }

        if (isEmbed && (isPathnameChanged || isQueryChanged)) {
            const pathname = nextLocation.pathname;
            const { category, search, sortType } = nextLocation.query;

            const query = {};

            if (category) {
                query.category = category;
            }

            if (search) {
                query.search = search;
            }

            if (sortType) {
                query.sortType = sortType;
            }

            const quizWallEmbedPath = this.props.history.createHref(pathname, query);

            embedEvents.send({
                type : 'PATH_CHANGED',
                quizWallEmbedPath
            });
        }
    }

    componentDidUpdate() {
        if (isIOSDevice()) {
            const nextHeightOfAppContainer = this.getContainerHeight();

            if (nextHeightOfAppContainer !== this.appContainerHeight) {
                this.sendIframeHeightEvent(nextHeightOfAppContainer);

                this.appContainerHeight = nextHeightOfAppContainer;
            } else {
                this.iframeHeightCalcTimer = setTimeout(() => {
                    const newHeightOfAppContainer = this.getContainerHeight();

                    this.sendIframeHeightEvent(newHeightOfAppContainer);

                    this.appContainerHeight = newHeightOfAppContainer;
                }, TIMER_DELAY);
            }
        }
    }

    componentWillUnmount() {
        this.appContainerHeight = null;
    }

    handleRedirect = () => {
        const { query } = this.props.location;

        const newState = {
            embed      : query.embed,
            assigneeId : query.assigneeId
        };

        if (query.search) {
            newState.search = query.search;
        }

        this.props.history.pushState(null, '/activations', newState);
    };

    getContainerHeight = () => {
        return document.getElementById('app-view').scrollHeight;
    };

    sendIframeHeightEvent = (height = 0) => {
        embedEvents.send({
            type         : 'IFRAME_HEIGHT_CALCULATED',
            iframeHeight : height
        });
    }

    render() {
        return (
            <div id='app-view'>
                {this.props.children}
            </div>
        );
    }
}
