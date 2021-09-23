import * as apiResponseFormatter from '../utils/apiResponseFormatter';

import {
    LOAD_ACTIVATIONS_SUCCESS,
    LOAD_ACTIVATIONS_REQUEST
} from '../actions/activations';

const DEFAULT_STATE = {
    entitiesByCategory: {},
    totalActivationsAmount: 0,
    isLoadingNextActivations: false,
    isLoading : true,
    category : 'all',
    search: '',
    sortType : 'new'
};

export default function activations(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case LOAD_ACTIVATIONS_SUCCESS: {
            const newActivations = action.activations.map(activation => {
                const author = action.accounts.find(account => account.id === activation.links.owner.id);

                return apiResponseFormatter.formatActivation(activation, author);
            });

            const loadedActivations = state.entitiesByCategory[action.category]
                ? state.entitiesByCategory[action.category].slice(0)
                : [];

            newActivations.forEach((newActivation, i) => {
                if (action.offset + i < loadedActivations.length) {
                    loadedActivations[action.offset + i] = newActivation;
                } else {
                    loadedActivations.push(newActivation);
                }
            });

            const entitiesByCategory = {
                ...entitiesByCategory,
                [action.category]: loadedActivations
            };

            return {
                ...state,
                entitiesByCategory,
                totalActivationsAmount : action.totalAmount,
                isLoading              : false
            };
        }

        case LOAD_ACTIVATIONS_REQUEST: {
            const isSortTypeChanged = state.sortType !== action.sortType;
            const isSearchChanged = state.search !== action.search;

            const isLoading = !state.entitiesByCategory[action.category]
                || isSortTypeChanged
                || isSearchChanged;

            return {
                ...state,
                isLoading,
                search             : action.search,
                entitiesByCategory : isSortTypeChanged || isSearchChanged ? {} : state.entitiesByCategory,
                category           : action.category,
                sortType           : action.sortType
            };
        }

        default: {
            return state;
        }
    }
}
