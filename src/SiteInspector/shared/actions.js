import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { constructJsllDQInput } from './reducer';
import {
    runJsllDQRules,
    mergeRules,
} from '../utils/jsllDQHelpers';
import {
    STATUS,
} from '../utils/jsllDQConfig';

export const ADD_HTTP_ITEM = 'ADD_HTTP_ITEM';
export const ADD_JSLL_EVENT = 'ADD_JSLL_EVENT';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MS_CV_HTTP_ITEM = 'ADD_MS_CV_HTTP_ITEM';
export const CLEAR_JSLL_EVENTS = 'CLEAR_JSLL_EVENTS';
export const COLLAPSE_MESSAGE = 'COLLAPSE_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const SET_CURRENT_SESSION_TIMINGS = 'SET_CURRENT_SESSION_TIMINGS';
export const SET_INIT_FLAG = 'SET_INIT_FLAG';
export const SET_JSLL_CONFIG = 'SET_JSLL_CONFIG';
export const SET_JSLL_PAGE_PROPERTY = 'SET_JSLL_PAGE_PROPERTY';
export const SET_LOCALE_VALUES = 'SET_LOCALE_VALUES';
export const SET_SHARED_STATE_CONFIG_DATA = 'SET_SHARED_STATE_CONFIG_DATA';
export const SIGNAL_JSLL_PAGE_VIEW = 'SIGNAL_JSLL_PAGE_VIEW';
export const SIGNAL_URL_CHANGE = 'SIGNAL_URL_CHANGE';
export const UPDATE_JSLL_DQ_RESULTS = 'UPDATE_JSLL_DQ_RESULTS';
export const UPDATE_JSLL_DQ_RULES = 'UPDATE_JSLL_DQ_RULES';

export function addHttpInterceptItem(siPayload) {
  return {
    type: ADD_HTTP_ITEM,
    siPayload,
  };
}

export function addJsllEvent(jsllEvent, id) {
  return {
    type: ADD_JSLL_EVENT,
    jsllEvent: {
      id,
      issues: [],
      content: jsllEvent,
    },
  };
}

export function collapseMessage(messageKey) {
  return {
    type: COLLAPSE_MESSAGE,
    messageKey,
  };
}

export function removeMessage(messageKey) {
  return {
    type: REMOVE_MESSAGE,
    messageKey,
  };
}

export function addMessage(message) {
  if (typeof message === 'string') {
    message = {
      text: message,
      timeout: 5000,
      type: MessageBarType.info,
    };
  }

  return function start(dispatch) {
    if (message && !message.key) {
      message.key = Math.random().toString(36).substring(7);
    }

    if (message.timeout && message.timeout > 0) {
      setTimeout(() => {
        dispatch(collapseMessage(message.key));
      }, message.timeout);

      setTimeout(() => {
        dispatch(removeMessage(message.key));
      }, message.timeout + 750);
    }

    dispatch({
      type: ADD_MESSAGE,
      message,
    });
  };
}

export function addErrorMessage(text) {
  return function start(dispatch) {
    dispatch(addMessage({
      text,
      type: MessageBarType.error,
    }));
  };
}

export function addMsCvHttpItem(siPayload) {
  return {
    type: ADD_MS_CV_HTTP_ITEM,
    siPayload,
  };
}

export function clearJsllEvents() {
  return {
    type: CLEAR_JSLL_EVENTS,
  };
}

export const setCurrentSessionTimings = data => ({
  type: SET_CURRENT_SESSION_TIMINGS,
  data,
});

export const setInitFlag = flag => ({
  type: SET_INIT_FLAG,
  flag,
});

export const setJsllConfig = config => ({
  type: SET_JSLL_CONFIG,
  config,
});

export function setJsllPageProperty(name, value) {
  return {
    type: SET_JSLL_PAGE_PROPERTY,
    name,
    value,
  };
}

export function setLocaleValues(locale) {
  return {
    type: SET_LOCALE_VALUES,
    locale,
  };
}

export function setSharedStateConfigData(config) {
  return {
    type: SET_SHARED_STATE_CONFIG_DATA,
    config,
  };
}

export function signalJsllPageView() {
  return {
    type: SIGNAL_JSLL_PAGE_VIEW,
  };
}

export function signalUrlChange() {
  return {
    type: SIGNAL_URL_CHANGE,
  };
}

export const updateJsllDQResults = jsllDQResults => ({
  type: UPDATE_JSLL_DQ_RESULTS,
  jsllDQResults,
});

export const updateJsllDQResultsAction = () => (dispatch, getState) => {
  dispatch(
        updateJsllDQResults(
            runJsllDQRules(
                getState().SharedState.jsll.jsllDQRules,
                constructJsllDQInput(getState()),
            ),
        ),
    );
};

export const updateJsllDQRules = (jsllDQRules, jsllDQRulesChangeLog) => ({
  type: UPDATE_JSLL_DQ_RULES,
  jsllDQRules,
  jsllDQRulesChangeLog,
});

export const updateJsllDQRulesAction = ruleUpdates => (dispatch, getState) => {
  if (ruleUpdates) {
        // This object will contain the return values
    const retObj = {};

    mergeRules(
            getState().SharedState.jsll.jsllDQRules,
            ruleUpdates,
            getState().SharedState.jsll.jsllDQRulesChangeLog,
            retObj,
        );

    dispatch(
            updateJsllDQRules(
                retObj.rules,
                retObj.changeLog,
            ),
        );
  }
};

export const getJsllDQResults = function getJsllDQResults(callback = null, getIssues = false) {
  return (dispatch, getState) => {
    dispatch(updateJsllDQResultsAction());

    if (callback) {
      if (getIssues) {
        callback(
                    getState().SharedState.jsll.jsllDQResultsDataByType.filter(
                        result => result.status === STATUS.failed,
                    ),
                );
      } else {
        callback(
                    getState().SharedState.jsll.jsllDQResultsDataByType,
                );
      }
    }
  };
};
