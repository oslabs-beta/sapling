import { combineReducers } from 'redux';
 import geekReducer from './geekReducer';
  
 export default combineReducers({
   fake: fakeReducer,
 });
