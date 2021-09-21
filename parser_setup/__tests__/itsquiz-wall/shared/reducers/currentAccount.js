import { SET_SESSION_TYPE } from '../actions/accounts';

const DEFAULT_STATE = {
    isOrganization: false
};

export default function currentAccount(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_SESSION_TYPE:
            return {
                ...state,
                isOrganization: action.isOrganization
            };
        default:
            return state;
    }
}
