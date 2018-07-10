import {
  ADD_JSLL_EVENT,
  ADD_MESSAGE,
  ADD_MS_CV_HTTP_ITEM,
  CLEAR_JSLL_EVENTS,
  COLLAPSE_MESSAGE,
  REMOVE_MESSAGE,
  SET_INIT_FLAG,
  SET_LOCALE_VALUES,
  SET_JSLL_CONFIG,
  SET_JSLL_PAGE_PROPERTY,
  SET_SHARED_STATE_CONFIG_DATA,
  SET_CURRENT_SESSION_TIMINGS,
  UPDATE_JSLL_DQ_RESULTS,
  UPDATE_JSLL_DQ_RULES,
} from './actions';
import {
  RECEIVE_AUTH_TOKEN_SUCCESS,
  RECEIVE_TOKEN_FROM_LOCAL_STORAGE,
  INVALIDATE_TOKEN,
} from '../views/Shell/actions';
import environment from './environment';
import { getCountryFromLocale } from '../shared/localization';
import constants from '../shared/constants';
import { getProperty } from '../utils/jsllDQHelpers';
import {
    JSLL_DQ_RULES,
} from '../utils/jsllDQConfig';

export const initialState = {
  siteInspectorInitialized: false,
  sifd: {
    hostName: environment.siteInspectorFDUrl,
    token: '',
  },
  user: '',
  messages: [],
  mscvItems: [],
  mscvMap: {},
  siteInspectorEnabledFlightName: '',
  siteInspectorEnabledUrl: '',
  appId: '',
  localizationUrlTemplate: '',
  locale: '',
  country: constants.defaultCountry,
  jsll: {
    isWaitingForSessionTimings: true,
    jsllDQRules: JSLL_DQ_RULES,
    jsllDQRulesChangeLog: '',
    jsllDQResultsDataByType: [],
    jsllDQResultsAreStale: true,
  },
};

// Using the selector pattern (https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170)
function getJsllEventsForDQ(jsllEvents, appId, pageName) {
    // We assume that the jsllEvents are in the order of which they were fired
  if (!jsllEvents || !jsllEvents.length || !appId || !pageName) {
    return jsllEvents;
  }

    // Find all events after the last pageView
    // (this logic will likely change since we will want to
    // analyze events from the prev page as well)
  let startIndex = 0;
  for (let i = jsllEvents.length - 1; i >= 0; i -= 1) {
    if (jsllEvents[i].baseType === 'Ms.Content.PageView') {
      startIndex = i;
      break;
    }

    if (jsllEvents[i] &&
            jsllEvents[i].appId !== appId &&
            jsllEvents[i].data &&
            jsllEvents[i].data.baseData &&
            jsllEvents[i].data.baseData.pageName !== pageName
        ) {
      startIndex = i;
      break;
    }
  }

  return jsllEvents.slice(startIndex, jsllEvents.length);
}

export function constructJsllDQInput(state) {
  const jsllAppId = getProperty(state, 'SharedState.jsll.appId');
  const jsllPageName = getProperty(state, 'SharedState.jsll.pageName');
  const jsllConfig = getProperty(state, 'SharedState.jsll.config');
  const events = getProperty(state, 'SharedState.jsll.events');

  return {
    jsllAppId,
    jsllPageName,
    jsllEvents: getJsllEventsForDQ(
            events,
            jsllAppId,
            jsllPageName,
        ),
    jsllConfig,
  };
}

const SharedReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE: {
      return { ...state, messages: [...state.messages, action.message] };
    }
    case COLLAPSE_MESSAGE: {
      // eslint-disable-next-line no-confusing-arrow
      const messages = state.messages.map(message =>
        message.key === action.messageKey
          ? { ...message, isCollapsing: true }
          : message);
      return { ...state, messages };
    }
    case REMOVE_MESSAGE: {
      const messages = state.messages.filter(message => message.key !== action.messageKey);
      return { ...state, messages };
    }
    case SET_INIT_FLAG: {
      return { ...state, siteInspectorInitialized: action.flag };
    }
    case SET_LOCALE_VALUES: {
      return { ...state,
        locale: action.locale,
        country: action.locale
            ? getCountryFromLocale(action.locale)
            : window.location.pathname && window.location.pathname.indexOf('/en-us/') !== -1
                ? getCountryFromLocale('en-us')
                : constants.defaultCountry,
      };
    }
    case ADD_MS_CV_HTTP_ITEM: {
      const requestCv = action.siPayload.request.headers['MS-CV'] || action.siPayload.request.headers['ms-cv'];

      if (requestCv) {
        const newState = {
          ...state,
          mscvItems: [action.siPayload, ...state.mscvItems],
          cvMap: {
            ...state.cvMap,
            [requestCv]: state.cvMap[requestCv]
                            ? state.cvMap[requestCv] += 1 : 1,
          },
        };

        return newState;
      }

      return { ...state, mscvItems: [action.siPayload, ...state.mscvItems] };
    }
    case SET_SHARED_STATE_CONFIG_DATA: {
      return {
        ...state,
        siteInspectorEnabledFlightName: action.config.siteInspectorEnabledFlightName,
        siteInspectorEnabledUrl: action.config.siteInspectorEnabledUrl,
        localizationUrlTemplate: action.config.localizationUrlTemplate,
        locale: action.config.locale,
        appId: action.config.appId || state.appId,
      };
    }
    case RECEIVE_AUTH_TOKEN_SUCCESS: {
      return {
        ...state,
        sifd: { ...state.sifd, token: action.token },
        user: action.user,
      };
    }
    case RECEIVE_TOKEN_FROM_LOCAL_STORAGE: {
      return {
        ...state,
        sifd: { ...state.sifd, token: action.token },
        user: action.user,
      };
    }
    case INVALIDATE_TOKEN: {
      return {
        ...state,
        sifd: { ...state.sifd, token: '' },
        user: '',
      };
    }
    case ADD_JSLL_EVENT: {
      const newJsllState = Object.assign({}, state.jsll);
      if (newJsllState.events) {
        newJsllState.events = [...newJsllState.events, action.jsllEvent];
      } else {
        newJsllState.events = [];
        newJsllState.events.push(action.jsllEvent);
      }
      newJsllState.jsllDQResultsAreStale = true;
      return { ...state, jsll: newJsllState };
    }
    case CLEAR_JSLL_EVENTS: {
      const newJsllState = Object.assign({}, state.jsll);
      newJsllState.events = [];
      newJsllState.jsllDQResultsAreStale = true;
      return { ...state, jsll: newJsllState };
    }
    case SET_JSLL_CONFIG: {
      const newJsllState = Object.assign({}, state.jsll);
      newJsllState.config = action.config;
      return { ...state, jsll: newJsllState };
    }
    case SET_JSLL_PAGE_PROPERTY: {
      let appId = state.appId;
      const newJsllState = Object.assign({}, state.jsll);
      switch (action.name.toLowerCase()) {
        case 'appid':
          newJsllState.appId = action.value;
          // set appId to jsll appId only if config appId was missing
          if (!appId) {
            appId = action.value.toLowerCase().indexOf('js:') !== -1
                  ? action.value.split('js:')[1]
                  : action.value;
          }
          break;
        case 'pagename':
          newJsllState.pageName = action.value;
          break;
        default:
          newJsllState[action.name] = action.value;
      }
      return { ...state, appId, jsll: newJsllState };
    }
    case UPDATE_JSLL_DQ_RESULTS: {
      const newJsllState = Object.assign({}, state.jsll);
      newJsllState.jsllDQResultsDataByType = action.jsllDQResults;
      newJsllState.jsllDQResultsAreStale = false;
      return { ...state, jsll: newJsllState };
    }
    case UPDATE_JSLL_DQ_RULES: {
      const newJsllState = Object.assign({}, state.jsll);
      newJsllState.jsllDQRules = action.jsllDQRules;
      newJsllState.jsllDQRulesChangeLog = action.jsllDQRulesChangeLog;
      newJsllState.jsllDQResultsAreStale = true;
      return { ...state, jsll: newJsllState };
    }
    case SET_CURRENT_SESSION_TIMINGS: {
      const newJsllState = Object.assign({}, state.jsll);
      const newCurrentSessionTimings = Object.assign({}, state.jsll.currentSessionTimings);
      if (action.data) {
        delete newCurrentSessionTimings[action.data.id];
        newCurrentSessionTimings[action.data.id] = {
          name: action.data.name,
          value: action.data.value,
          type: action.data.type,
          url: action.data.url,
          tooltipTitle: action.data.tooltipTitle,
        };
      }
      newJsllState.currentSessionTimings = newCurrentSessionTimings;
      newJsllState.isWaitingForSessionTimings = false;
      return { ...state, jsll: newJsllState };
    }
    default:
      return state;
  }
};

export default SharedReducer;
