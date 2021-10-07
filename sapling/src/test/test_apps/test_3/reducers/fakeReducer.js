import * as types from '../constants/actionTypes';

const initialState = {
  count: 0,
};
  
const fakeReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case types.FAKE_ACTION_1: {
      return {
        count: count + 1,
      }
    } 

    case types.FAKE_ACTION_2: {
      return {
        count: count + 2,
      }
    }

    default:
      return state;    
    }
};

export default fakeReducer;
