import api from '../apiSingleton';

import { loadAssessmentSystem } from './assessmentSystems';

export const LOAD_ACTIVATIONS_SUCCESS    = 'LOAD_ACTIVATIONS_SUCCESS';
export const LOAD_ACTIVATIONS_FAIL       = 'LOAD_ACTIVATIONS_FAIL';
export const LOAD_ACTIVATIONS_REQUEST    = 'LOAD_ACTIVATIONS_REQUEST';

const LIMIT_PER_QUERY = 24;

export function loadActivations({ query = {}, offset = 0 }) {
    return (dispatch) => {
        dispatch({
            type      : LOAD_ACTIVATIONS_REQUEST,
            category  : query.category || 'ALL',
            sortType  : query.sortType || 'new',
            search    : query.search || ''
        });

        return api.activations.list({
            offset,
            include     : 'accounts',
            limit       : LIMIT_PER_QUERY,
            search      : query.search || '',
            category    : query.category !== 'SPECIAL' ? query.category : '',
            isSponsored : query.category === 'SPECIAL' ? true : '',
            sortBy      : query.sortType || '',
            assigneeId  : query.assigneeId || ''

        }).then(({ data, linked }) => {
            dispatch({
                offset,
                category    : query.category || 'ALL',
                sortType    : query.sortType || 'new',
                search      : query.search || '',
                type        : LOAD_ACTIVATIONS_SUCCESS,
                activations : data.entities,
                totalAmount : data.total,
                accounts       : linked.accounts
            });
        });
    };
}

export const LOAD_ACTIVATION_REQUEST = 'LOAD_ACTIVATION_REQUEST';
export const LOAD_ACTIVATION_SUCCESS = 'LOAD_ACTIVATION_SUCCESS';
export const LOAD_ACTIVATION_FAIL    = 'LOAD_ACTIVATION_FAIL';

export function loadActivation({ params = {}, query = {}, locale }) {
    const assigneeId = params.accountId || query.assigneeId || '';

    return dispatch => {
        dispatch({ type : LOAD_ACTIVATION_REQUEST, activationId : params.id });

        return api.activations.show(params.id, {
            assigneeId,
            include: 'accounts',
            digest: query.digest,
            accountfromemail: query.accountId
        }).then(response => {
            const accountId = response.data.links.owner.id;

            const authorActivationsPromise = dispatch(loadAuthorActivations({
                accountId,
                assigneeId,
                openedActivationId: response.data.id,
                limit: 8
            }));

            const activationPromise = dispatch({
                type       : LOAD_ACTIVATION_SUCCESS,
                activation : response.data,
                author     : response.linked.accounts.find(account => account.id === accountId)
            });

            let assessmentSystemPromise;

            if (assigneeId) {
                assessmentSystemPromise = dispatch(loadAssessmentSystem(response.data, locale));
            }

            return Promise.all([assessmentSystemPromise, activationPromise, authorActivationsPromise]);
        }).catch(error => {
            dispatch({
                type: LOAD_ACTIVATION_FAIL,
                error
            });
        });
    };
}

export const LOAD_SIMILAR_ACTIVATIONS_REQUEST = 'LOAD_SIMILAR_ACTIVATIONS_REQUEST';
export const LOAD_SIMILAR_ACTIVATIONS_SUCCESS = 'LOAD_SIMILAR_ACTIVATIONS_SUCCESS';
export const LOAD_SIMILAR_ACTIVATIONS_FAIL    = 'LOAD_SIMILAR_ACTIVATIONS_FAIL';

export function loadSimilarActivations({ params = {}, query = {} }) {
    const assigneeId = query.assigneeId || params.accountId || '';
    const similarTo = params.id;

    return dispatch => {
        dispatch({ type : LOAD_SIMILAR_ACTIVATIONS_REQUEST });

        return api.activations.list({
            similarTo, assigneeId, limit: 8, include: 'accounts'
        }).then(({ data, linked }) => {
            dispatch({
                similarTo,
                type        : LOAD_SIMILAR_ACTIVATIONS_SUCCESS,
                accounts    : linked.accounts,
                activations : data.entities
            });
        }).catch(error => {
            dispatch({
                type: LOAD_SIMILAR_ACTIVATIONS_FAIL,
                error
            });
        });
    };
}

export const LOAD_AUTHOR_ACTIVATIONS_SUCCESS = 'LOAD_AUTHOR_ACTIVATIONS_SUCCESS';
export const LOAD_AUTHOR_ACTIVATIONS_FAIL    = 'LOAD_AUTHOR_ACTIVATIONS_FAIL';

export function loadAuthorActivations(params) {
    const {
        accountId = '',
        assigneeId = '',
        openedActivationId = '',
        limit = 0,
        isAllActivationsLoaded = false
    } = params;

    return (dispatch, getState) => {
        const authorId = accountId || getState().currentActivation.activation.author.id;
        const activationId = openedActivationId || getState().currentActivation.activation.id;

        return api.activations.list({ accountId: authorId, assigneeId, limit }).then((response) => {
            dispatch({
                isAllActivationsLoaded,
                type               : LOAD_AUTHOR_ACTIVATIONS_SUCCESS,
                openedActivationId : activationId,
                authorActivations  : response.data.entities
            });
        }).catch(error => {
            dispatch({
                type: LOAD_AUTHOR_ACTIVATIONS_FAIL,
                error
            });
        });
    };
}
