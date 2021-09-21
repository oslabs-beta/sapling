import React, { PropTypes } from 'react';
import Promise from 'bluebird';

let IS_FIRST_MOUNT_AFTER_LOAD = true;

export default function connectDataFetchers(Component, actionCreators) {
    return class DataFetchersWrapper extends React.Component {
        static contextTypes = { i18n: PropTypes.object };

        static propTypes = {
            dispatch : PropTypes.func.isRequired,
            params   : PropTypes.object.isRequired,
            location : PropTypes.shape({
                pathname : PropTypes.string.required,
                search   : PropTypes.string,
                query    : PropTypes.string.object
            }).isRequired
        };

        static fetchData({ dispatch, params = {}, query = {}, locale }) {
            return Promise.all(
                actionCreators.map(actionCreator => dispatch(actionCreator({ params, query, locale })))
            );
        }

        componentDidUpdate(prevProps) {
            const { location } = this.props;
            const { location: prevLocation } = prevProps;

            const isUrlChanged = (location.pathname !== prevLocation.pathname)
                              || (location.search !== prevLocation.search);

            if (isUrlChanged) {
                this._fetchDataOnClient();
            }
        }

        componentDidMount() {
            if (!IS_FIRST_MOUNT_AFTER_LOAD) {
                this._fetchDataOnClient();
            }

            IS_FIRST_MOUNT_AFTER_LOAD = false;
        }


        _fetchDataOnClient() {
            const locale = this.context.i18n ? this.context.i18n.getLocale() : 'en';

            DataFetchersWrapper.fetchData({
                locale,
                dispatch : this.props.dispatch,
                params   : this.props.params,
                query    : this.props.location.query
            });
        }

        render() {
            return (
                <Component {...this.props} />
            );
        }
    };
}
