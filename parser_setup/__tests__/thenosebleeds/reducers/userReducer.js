import * as types from '../constants/actionTypes';

// Reducer that handles user login, logout and authentication

const initialState = {
  username: null,
  useremail: null,
  user_id: null,
  authUser: false,
  loginForm: { email: '', password: '' },
  signupForm: { email: '', username: '', password: '' },
  watchlist: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_LOGIN:
      console.log('TYRING TO UPDATE LOGIN STATE FORM: ', action.payload.field, action.payload.value);
      return {
        ...state,
        loginForm: { ...state.loginForm, [action.payload.field]: action.payload.value },
      };

    case types.SEND_SIGNUP:
      console.log('TRYING TO SEND SIGNUP TO SERVER: ', action.payload.email, action.payload.username, action.payload.password);
      return state;

    case types.LOGIN_SUCCESSFUL:
      console.log('LOGGED IN SUCCESSFULLY!');
      const { user_id, email, username } = action.payload;
      return {
        ...state,
        authUser: true,
        user_id,
        username,
        useremail: email,
      };

    case types.SEND_LOGOUT:
      console.log('LOGGING OUT!');
      return {
        username: null,
        useremail: null,
        user_id: null,
        authUser: false,
        loginForm: { email: '', password: '' },
        signupForm: { email: '', username: '', password: '' },
      };

    case types.UPDATE_SIGNUP:
      console.log('TYRING TO UPDATE SIGNUP FORM: ', action.payload.field, action.payload.value);
      return {
        ...state,
        signupForm: { ...state.signupForm, [action.payload.field]: action.payload.value },
      };

    case types.GET_WATCHLIST:
      console.log('UPDATING WATCHLIST: ', action.payload);
      return {
        ...state,
        watchlist: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
