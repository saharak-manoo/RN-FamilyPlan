import {createStore, applyMiddleware} from 'redux';
import * as reducer from './Reducers/Reducer';
import thunk from 'redux-thunk';

export default Store = () => {
  let store = createStore(reducer, applyMiddleware(thunk));
  return store;
};
