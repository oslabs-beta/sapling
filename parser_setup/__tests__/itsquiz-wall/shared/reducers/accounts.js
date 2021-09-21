import {
    LOAD_ACCOUNTS_SUCCESS
} from '../actions/accounts';

export default function accounts(state = [], action) {
    switch (action.type) {
        case LOAD_ACCOUNTS_SUCCESS:
            return action.accounts;
        default:
            return state;
    }
}
