// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
  TOGGLE_SHELL,
  SET_BUILD_VERSION,
  SET_SHELL_PANEL_POSITION,
  REGISTER_TAB,
  SET_CURRENT_PATH,
  SET_AUTH_STATE,
  REQUEST_AUTH_TOKEN,
  RECEIVE_AUTH_TOKEN_SUCCESS,
  RECEIVE_AUTH_TOKEN_ERROR,
  REQUEST_AUTH_TOKEN_TIMEOUT,
  RECEIVE_TOKEN_FROM_LOCAL_STORAGE,
  INVALIDATE_TOKEN,
  RESET_ROUTE_UPDATE,
  TOGGLE_DISABLE_MODAL,
} from './actions';
import routes from '../../router/routes';
import authenticationStates from '../../shared/authenticationStates';
import config from '../../shared/config';

export const initialState = {
  authenticationState: authenticationStates.SIGNED_OUT,
  currentPath: '',
  activeState: '',
  position: 'right',
  tabs: [],
  authenticationSuccessTime: 0,
  visible: false,
  routesUpdated: false,
  isVisibleDisableModal: false,
};

const ShellReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SHELL: {
      return Object.assign({}, state, { visible: !state.visible });
    }
    case TOGGLE_DISABLE_MODAL: {
      return { ...state, isVisibleDisableModal: !state.isVisibleDisableModal };
    }
    case SET_BUILD_VERSION: {
      return Object.assign({}, state, {
        buildVersion: action.buildVersion,
      });
    }
    case SET_SHELL_PANEL_POSITION: {
      return { ...state, position: action.position };
    }
    case RESET_ROUTE_UPDATE:
      {
        return { ...state, routesUpdated: false };
      }
    case SET_CURRENT_PATH: {
      let targetRoute;
      if (action.path) {
        targetRoute = routes.find(route => route.path === action.path);
      }
      return {
        ...state,
        currentPath: action.path,
        activeState: (targetRoute && targetRoute.state) || state.activeState,
      };
    }
    case REGISTER_TAB: {
      let routesUpdated = false;
      let targetRoute;

      if (action.tab) {
        targetRoute = routes.find(route =>
          route.id.toUpperCase() === action.tab.id.toUpperCase());

        if (targetRoute) {
          targetRoute.label = action.tab.title || targetRoute.label;
        } else {
          routes.push({
            id: action.tab.id,
            label: action.tab.label,
            path: `/${action.tab.id.toLowerCase()}`,
            component: action.tab.component,
            state: (action.tab.reducerMap &&
                Object.keys(action.tab.reducerMap).length &&
                Object.keys(action.tab.reducerMap)[0]) || '',
          });
          routesUpdated = true;
        }
      }

      const tabs = state.tabs.indexOf(action.tab.id) === -1
          ? [...state.tabs, action.tab.id]
          : state.tabs.slice(0);

      return { ...state,
        tabs: config.tabs.map(tab => tab.id).filter(tab => tabs.indexOf(tab) !== -1),
        routesUpdated,
      };
    }
    case SET_AUTH_STATE: {
      return { ...state, authenticationState: action.authenticationState };
    }
    case REQUEST_AUTH_TOKEN: {
      return { ...state, authenticationState: action.authenticationState };
    }
    case RECEIVE_AUTH_TOKEN_ERROR: {
      return { ...state, authenticationState: action.authenticationState };
    }
    case RECEIVE_AUTH_TOKEN_SUCCESS: {
      let authenticationSuccessTime = new Date().getTime();
      if (action.createdOn) {
        authenticationSuccessTime = action.createdOn.getTime();
      }
      if (typeof Storage !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('siteInspectorFDtoken', `${action.token},${action.user},${authenticationSuccessTime}`);
      }
      return {
        ...state,
        authenticationState: action.authenticationState,
        authenticationSuccessTime,
      };
    }
    case REQUEST_AUTH_TOKEN_TIMEOUT: {
      return { ...state, token: action.token, authenticationState: action.authenticationState };
    }
    case RECEIVE_TOKEN_FROM_LOCAL_STORAGE: {
      return {
        ...state,
        authenticationState: action.authenticationState,
        authenticationSuccessTime: action.authenticationSuccessTime,
      };
    }
    case INVALIDATE_TOKEN: {
      if (typeof Storage !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('siteInspectorFDtoken');
      }
      return {
        ...state,
        authenticationState: action.authenticationState,
        authenticationSuccessTime: 0,
      };
    }
    default:
      return state;
  }
};

export default ShellReducer;
