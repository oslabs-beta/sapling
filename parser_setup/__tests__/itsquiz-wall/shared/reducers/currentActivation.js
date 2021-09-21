import * as apiResponseFormatter from '../utils/apiResponseFormatter';

import {
    LOAD_ACTIVATION_REQUEST,
    LOAD_ACTIVATION_SUCCESS,
    LOAD_SIMILAR_ACTIVATIONS_SUCCESS,
    LOAD_ACTIVATIONS_REQUEST,
    LOAD_AUTHOR_ACTIVATIONS_SUCCESS
} from '../actions/activations';

const DEFAULT_STATE = {
    activation : {},
    authorActivations: [],
    similarActications: [],
    isLoadingActivation : true,
    isLoadingAuthorActivations: true,
    isAllAuthorActivationsLoaded: false
};

export default function currentActivation(state = DEFAULT_STATE, action) {
    // TODO normalize data. in currentActivation save only id. It will allow:
    // 1. Intant activation loading from activations list
    // 2. No activations blinking while you switch between them. From loaded activation to not loaded one.
    switch (action.type) {
        case LOAD_ACTIVATION_REQUEST: {
            const isLoading = state.activation.id !== action.activationId;

            return {
                ...state,
                activation : state.activation,
                isLoadingActivation : isLoading,
                isLoadingAuthorActivations : isLoading
            };
        }

        case LOAD_ACTIVATION_SUCCESS: {
            return {
                ...state,
                activation : apiResponseFormatter.formatActivation(action.activation, action.author),
                isLoadingActivation : false,
                isAllAuthorActivationsLoaded: false
            };
        }

        case LOAD_AUTHOR_ACTIVATIONS_SUCCESS: {
            const otherAuthorActivations = action.authorActivations.filter(authorActivation =>
               authorActivation.id !== action.openedActivationId
            );

            const authorActivations = otherAuthorActivations.map(authorActivation =>
                apiResponseFormatter.formatActivation(authorActivation)
            );

            return {
                ...state,
                authorActivations,
                isLoadingAuthorActivations : false,
                isAllAuthorActivationsLoaded: action.isAllActivationsLoaded
            };
        }

        case LOAD_SIMILAR_ACTIVATIONS_SUCCESS: {
            const similarActivations = action.activations.map(activation => {
                const author = action.accounts.find(account => account.id === activation.links.owner.id);

                return apiResponseFormatter.formatActivation(activation, author);
            });

            return {
                ...state,
                similarActivations
            };
        }

        // react on other reducers actions

        case LOAD_ACTIVATIONS_REQUEST: {
            return {
                ...state,
                ...DEFAULT_STATE
            };
        }

        default:
            return state;
    }
}
