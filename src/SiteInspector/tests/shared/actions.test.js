// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as actions from '../../shared/actions';
import SharedReducer from '../../shared/reducer';

configure({ adapter: new Adapter() });

describe('Shared actions', () => {
  const mockStore = configureMockStore([thunk]);
  const defaultState = {
    siteInspectorInitialized: false,
    messages: [],
    xhrItems: [],
  };
  const message = 'test message';

  describe('should be able to collapse and remove messages', () =>{
    let messageKey;
    let messageState;

    beforeEach(() => {
      const store = mockStore({ });

      store.dispatch(actions.addMessage(message));

      const [action] = store.getActions();
      messageState = SharedReducer(defaultState, action);

      messageKey = action.message.key;
    });

    it('collapseMessage should create COLLAPSE_MESSAGE action and set state', () => {
      const store = mockStore({ });

      const expectedAction = {
        type: actions.COLLAPSE_MESSAGE,
        messageKey,
      };

      store.dispatch(actions.collapseMessage(messageKey));

      const [action] = store.getActions();

      const expectedState = {
        ...defaultState,
        messages: [
          {
            text: message,
            timeout: 5000,
            type: 0,
            key: messageKey,
            isCollapsing: true,
          },
        ],
      };

      expect(action).toEqual(expectedAction);
      expect(SharedReducer(messageState, action)).toEqual(expectedState);
    });

    it('removeMessage should create REMOVE_MESSAGE action and set state', () => {
      const store = mockStore({ });

      const expectedAction = {
        type: actions.REMOVE_MESSAGE,
        messageKey,
      };

      store.dispatch(actions.removeMessage(messageKey));
      const [action] = store.getActions();

      const expectedState = {
        ...defaultState,
        messages: [],
      };

      expect(action).toEqual(expectedAction);
      expect(SharedReducer(messageState, action)).toEqual(expectedState);
    });
  });

  it('addMessage should dispatch and return ADD_MESSAGE action', () => {
    const store = mockStore({ });

    store.dispatch(actions.addMessage(message));

    const [action] = store.getActions();
    expect(action.type).toEqual(actions.ADD_MESSAGE);
    expect(action.message).toBeTruthy();
    expect(action.message.key).toBeTruthy();
    expect(action.message.type).toEqual(0);
    expect(action.message.text).toEqual(message);
  });

  it('addMessage should automatically collapse and remove itself', () => {
    const store = mockStore({ });

    jest.useFakeTimers();
    store.dispatch(actions.addMessage(message));
    jest.runAllTimers();

    const action = store.getActions();

    expect(action.length).toEqual(3);
    expect(action.filter(a => a.type === actions.ADD_MESSAGE)).toBeTruthy();
    expect(action.filter(a => a.type === actions.COLLAPSE_MESSAGE)).toBeTruthy();
    expect(action.filter(a => a.type === actions.REMOVE_MESSAGE)).toBeTruthy();
  });

  it('addErrorMessage should dispatch and return MessageBarType.error action', () => {
    const store = mockStore({ });

    store.dispatch(actions.addErrorMessage(message));

    const [action] = store.getActions();
    expect(action.type).toEqual(actions.ADD_MESSAGE);
    expect(action.message).toBeTruthy();
    expect(action.message.type).toEqual(1);
    expect(action.message.text).toEqual(message);
  });

  it('addXHRInterceptItem should return ADD_XHR_ITEM action and set state', () => {
    const payload = 'test';
    const expectedAction = {
      type: actions.ADD_XHR_ITEM,
      payload,
    };
    const store = mockStore({ });

    store.dispatch(actions.addXHRInterceptItem(payload));

    const [action] = store.getActions();
    const expectedState = {
      ...defaultState,
      xhrItems: [payload],
    };

    expect(action).toEqual(expectedAction);
    expect(SharedReducer(defaultState, action)).toEqual(expectedState);
  });

  it('setInitFlag should return SET_INIT_FLAG action and set state', () => {
    const flag = true;
    const expectedAction = {
      type: actions.SET_INIT_FLAG,
      flag,
    };
    const store = mockStore({ });

    store.dispatch(actions.setInitFlag(flag));

    const [action] = store.getActions();
    const expectedState = {
      ...defaultState,
      siteInspectorInitialized: flag,
    };

    expect(action).toEqual(expectedAction);
    expect(SharedReducer(defaultState, action)).toEqual(expectedState);
  });
});
