import { LOAD_ASSESSMENT_SYSTEM_SUCCESS } from '../actions/assessmentSystems';

const DEFAULT_STATE = {
    assessmentSystem : [],
    isLoading : true
};

export default function currentAssessmentSystem(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case LOAD_ASSESSMENT_SYSTEM_SUCCESS: {
            return {
                ...state,
                assessmentSystem : action.assessmentSystem,
                isLoading : false
            };
        }

        default:
            return state;
    }
}
