import api from '../apiSingleton';

import standardAssessmentSystems from '../utils/LocaleUtil/assessmentSystems.json';

export const LOAD_ASSESSMENT_SYSTEM_SUCCESS = 'LOAD_ASSESSMENT_SYSTEM_SUCCESS';
export const LOAD_ASSESSMENT_SYSTEM_FAIL    = 'LOAD_ASSESSMENT_SYSTEM_FAIL';

export function loadAssessmentSystem(activation, locale) {
    return (dispatch) => {
        if (activation.assessmentSystemType === 'GLOBAL') {
            const localizedStandardSystems = standardAssessmentSystems[locale.toUpperCase()];

            for (const standardSystemName in localizedStandardSystems) {
                if (localizedStandardSystems[standardSystemName].id === activation.assessmentSystemId) {
                    dispatch({
                        type             : LOAD_ASSESSMENT_SYSTEM_SUCCESS,
                        assessmentSystem : localizedStandardSystems[standardSystemName].assessmentSystem
                    });

                    return Promise.resolve();
                }
            }
        } else {
            return api.assessmentSystems.show(
                activation.assessmentSystemId
            ).then((response) => {
                dispatch({
                    type             : LOAD_ASSESSMENT_SYSTEM_SUCCESS,
                    assessmentSystem : response.assessmentSystem
                });
            }).catch(error => {
                dispatch({
                    type: LOAD_ASSESSMENT_SYSTEM_FAIL,
                    error
                });
            });
        }
    };
}
