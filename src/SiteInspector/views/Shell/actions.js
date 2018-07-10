import { fetchAuthenticationToken, setAuthorizationHeader, cleanTokenData, submitLog } from '../../dal/SiteInspectorService';
import authenticationStates from '../../shared/authenticationStates';

// shell actions
export const TOGGLE_SHELL = 'TOGGLE_SHELL';
export const SET_CURRENT_PATH = 'SET_CURRENT_PATH';
export const SET_SHELL_PANEL_POSITION = 'SET_SHELL_PANEL_POSITION';
export const REGISTER_TAB = 'REGISTER_TAB';
export const SET_BUILD_VERSION = 'SET_BUILD_VERSION';
export const ADD_XHR_ITEM = 'ADD_XHR_ITEM';
export const ADD_JSLL_EVENT_BUFFER = 'ADD_JSLL_EVENT_BUFFER';
export const RESET_ROUTE_UPDATE = 'RESET_ROUTE_UPDATE';
export const TOGGLE_DISABLE_MODAL = 'TOGGLE_DISABLE_MODAL';

// auth actions
export const SET_AUTH_STATE = 'SET_AUTH_STATE';
export const REQUEST_AUTH_TOKEN = 'REQUEST_AUTH_TOKEN';
export const RECEIVE_AUTH_TOKEN_SUCCESS = 'RECEIVE_AUTH_TOKEN_SUCCESS';
export const RECEIVE_AUTH_TOKEN_ERROR = 'RECEIVE_AUTH_TOKEN_ERROR';
export const REQUEST_AUTH_TOKEN_TIMEOUT = 'REQUEST_AUTH_TOKEN_TIMEOUT';
export const RECEIVE_TOKEN_FROM_LOCAL_STORAGE = 'RECEIVE_TOKEN_FROM_LOCAL_STORAGE';
export const INVALIDATE_TOKEN = 'INVALIDATE_TOKEN';

export const addXhrItem = item => ({
  type: ADD_XHR_ITEM,
  item,
});

export const addJsllEventBuffer = event => ({
  type: ADD_JSLL_EVENT_BUFFER,
  event,
});

export const toggleShell = () => ({
  type: TOGGLE_SHELL,
});

export const toggleDisableModal = () => ({
  type: TOGGLE_DISABLE_MODAL,
});

export const setCurrentPath = path => ({
  type: SET_CURRENT_PATH,
  path,
});

export const logSiteInspectorTabChange = function logSiteInspectorTabChange(view) {
  return () => submitLog('tab_change', { tabName: view });
};

export const logSiteInspectorDisable = function logSiteInspectorDisable() {
  return () => submitLog('disable_siteInspector');
};


export const setShellPanelPosition = position => ({
  type: SET_SHELL_PANEL_POSITION,
  position,
});

export const registerTab = tab => ({
  type: REGISTER_TAB,
  tab,
});

export const resetRouteUpdate = () => ({
  type: RESET_ROUTE_UPDATE,
});

export const setBuildVersion = buildVersion => ({
  type: SET_BUILD_VERSION,
  buildVersion,
});

export const setAuthenticationState = authenticationState => ({
  type: SET_AUTH_STATE,
  authenticationState,
});

export const setTokenFromLocalStorage = properties => ({
  type: RECEIVE_TOKEN_FROM_LOCAL_STORAGE,
  token: properties.token,
  user: properties.user,
  authenticationSuccessTime: properties.authenticationSuccessTime,
  authenticationState: authenticationStates.GRANTED,
});

export const requestAuthToken = () => ({
  type: REQUEST_AUTH_TOKEN,
  authenticationState: authenticationStates.REQUESTING,
});

export const receiveAuthTokenError = error => ({
  type: RECEIVE_AUTH_TOKEN_ERROR,
  error,
  authenticationState: error === '401' ? authenticationStates.DENIED : authenticationStates.REQUESTING,
});

export const receiveAuthTokenSuccess = properties => ({
  type: RECEIVE_AUTH_TOKEN_SUCCESS,
  token: properties.token,
  user: properties.user,
  createdOn: properties.createdOn,
  authenticationState: authenticationStates.GRANTED,
});

export const requestAuthTokenTimeout = () => ({
  type: REQUEST_AUTH_TOKEN_TIMEOUT,
  authenticationState: authenticationStates.TIMED_OUT,
});

export const cleanTokenDataAction = data =>
  cleanTokenData(data.session)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.status);
      }
    })
    .catch(e => console.log(`${e} :Could not clean token data`));

export const fetchAuthToken = guid => (dispatch) => {
  dispatch(requestAuthToken());
  return fetchAuthenticationToken(guid)
      .then((response) => {
          // 401 when not part of OSG data extended and 404 when not on CorpNet.
        if (!response.ok) {
          throw Error(response.status);
        }
        return response.json();
      })
      .then((json) => {
        setAuthorizationHeader(json.token);
        cleanTokenDataAction(json);
        return dispatch(receiveAuthTokenSuccess({
          token: json.token,
          user: json.user,
          createdOn: new Date(Date.parse(json.createdOn)),
        }));
      })
      .then(null, err => dispatch(receiveAuthTokenError(err)));
};

export const invalidateToken = () => ({
  type: INVALIDATE_TOKEN,
  authenticationState: authenticationStates.SIGNED_OUT,
});
