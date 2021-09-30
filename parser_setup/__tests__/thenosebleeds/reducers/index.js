import { combineReducers } from 'redux';
import userReducer from './userReducer';
import ticketReducer from './ticketReducer';

// Combine and export reducer
export default combineReducers({
  users: userReducer,
  tickets: ticketReducer,
});
