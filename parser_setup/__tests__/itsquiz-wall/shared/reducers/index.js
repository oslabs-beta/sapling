import { combineReducers } from 'redux';

import activations             from './activations';
import currentActivation       from './currentActivation';
import accounts                from './accounts';
import currentAccount          from './currentAccount';
import currentAssessmentSystem from './currentAssessmentSystem';

const rootReducer = combineReducers({
    activations,
    currentActivation,
    accounts,
    currentAccount,
    currentAssessmentSystem
});

export default rootReducer;
