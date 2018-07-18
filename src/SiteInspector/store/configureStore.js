/* eslint no-underscore-dangle: ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION__"] }] */
import { applyMiddleware, createStore } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import throttle from 'lodash.throttle';
import { saveState, loadState } from './localStorage';
import createMainReducer from './reducers';

let middleware = applyMiddleware(thunk);

if (process.env.NODE_ENV !== 'production') {
  middleware = composeWithDevTools(middleware);
}

const store = createStore(createMainReducer(), loadState(), middleware);
store.asyncReducers = {};

export function injectAsyncReducer(storeToInject, asyncReducer) {
  storeToInject.asyncReducers = {
    ...storeToInject.asyncReducers,
    ...asyncReducer,
  };
  storeToInject.replaceReducer(createMainReducer(storeToInject.asyncReducers));
}

store.subscribe(throttle(() => {
    saveState(store.getState(), store.getState().ShellState.activeState);
}, 1000));

export default store;
