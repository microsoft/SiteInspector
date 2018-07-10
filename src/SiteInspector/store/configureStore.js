/* eslint no-underscore-dangle: ["error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION__"] }] */
import { applyMiddleware, createStore } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import throttle from 'lodash.throttle';
import { saveState, loadState, deleteState } from './localStorage';
import createMainReducer from './reducers';
import AuthenticationStates from '../shared/authenticationStates';

let middleware = applyMiddleware(thunk);

if (process.env.NODE_ENV !== 'production'
  && !process.env.EDGE_BUILD) {
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
  if (store.getState().ShellState.authenticationState === AuthenticationStates.GRANTED) {
    saveState(store.getState(), store.getState().ShellState.activeState);
  }

  // When token is expired it is invalidated and forces sign out. In this case, we want to delete
  // the saved state as well.
  if (store.getState().ShellState.authenticationState === AuthenticationStates.SIGNED_OUT) {
    deleteState();
  }
}, 1000));

export default store;
