import api                  from '../apiSingleton';
import apiResponseFormatter from '../utils/apiResponseFormatter';

export const LOAD_ACCOUNTS_SUCCESS = 'LOAD_ACCOUNTS_SUCCESS';

export function loadAccounts() {
    return (dispatch) => {
        return api.accounts.list().then((response) => {
            // TODO Move formatting to a reducer
            const accounts = response.data.entities.map(apiResponseFormatter.formatAuthorProfileData);

            dispatch({
                type: LOAD_ACCOUNTS_SUCCESS,
                accounts
            });
        });
    };
}

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';
export const LOAD_ACCOUNT_FAIL    = 'LOAD_ACCOUNT_FAIL';
export const LOAD_ACCOUNT_REQUEST = 'LOAD_ACCOUNT_REQUEST';
export const SET_SESSION_TYPE = 'SET_SESSION_TYPE';

export function loadAccount({ id }) {
    return (dispatch) => {
        return api.accounts.show(id).then((response) => {
            const account = apiResponseFormatter.formatAuthorProfileData(response.data);

            dispatch({
                type: LOAD_ACCOUNT_SUCCESS,
                account
            });
        }).catch(error => {
            dispatch({
                type: LOAD_ACCOUNT_FAIL,
                error
            });
        });
    };
}

export function loadAccountType({ query }) {
    return (dispatch) => {
        dispatch({
            type: SET_SESSION_TYPE,
            isOrganization: query.isOrganization === 'true'
        });
    };
}
