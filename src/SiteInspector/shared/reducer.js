import {
    ADD_MESSAGE,
    ADD_XHR_ITEM,
  COLLAPSE_MESSAGE,
  REMOVE_MESSAGE,
  SET_INIT_FLAG,
} from './actions';
import constants from '../shared/constants';

export const initialState = {
  siteInspectorInitialized: false,
    messages: [],
    xhrItems: []
};

const SharedReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE: {
      return { ...state, messages: [...state.messages, action.message] };
      }
      case ADD_XHR_ITEM: {
          return { ...state, xhrItems: [...state.xhrItems, action.payload] };
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
    default:
      return state;
  }
};

export default SharedReducer;
