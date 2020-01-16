import {createStore, applyMiddleware} from 'redux';
import * as reducer from './reducers/';
import thunk from 'redux-thunk';

export default Store = () => {
  let store = createStore(reducer, applyMiddleware(thunk));
  return store;
};
