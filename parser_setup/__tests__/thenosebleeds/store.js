import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from './reducers/index';

// we are adding composeWithDevTools here to get easy access to the Redux dev tools
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
