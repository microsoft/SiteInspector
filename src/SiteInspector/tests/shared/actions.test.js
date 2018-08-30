// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as actions from '../../shared/actions';

configure({ adapter: new Adapter() });

describe('Shared actions', () => {
  const mockStore = configureMockStore([thunk]);

  it('collapseMessage should create COLLAPSE_MESSAGE action', () => {
    const messageKey = 'message key';
    const expectedAction = {
      type: actions.COLLAPSE_MESSAGE,
      messageKey,
    };

    expect(actions.collapseMessage(messageKey)).toEqual(expectedAction);
  });

  it('removeMessage should create REMOVE_MESSAGE action', () => {
    const messageKey = 'message key';
    const expectedAction = {
      type: actions.REMOVE_MESSAGE,
      messageKey,
    };

    expect(actions.removeMessage(messageKey)).toEqual(expectedAction);
  });

  it('addMessage should dispatch and return ADD_MESSAGE action', () => {
    const message = 'test message';
    const store = mockStore({ });

    store.dispatch(actions.addMessage(message));

    const [action] = store.getActions();
    expect(action.type).toEqual(actions.ADD_MESSAGE);
    expect(action.message).toBeTruthy();
    expect(action.message.type).toEqual(0);
    expect(action.message.text).toEqual(message);
  });

  it('addErrorMessage should dispatch and return MessageBarType.error action', () => {
    const message = 'test message';
    const store = mockStore({ });

    store.dispatch(actions.addErrorMessage(message));

    const [action] = store.getActions();
    expect(action.type).toEqual(actions.ADD_MESSAGE);
    expect(action.message).toBeTruthy();
    expect(action.message.type).toEqual(1);
    expect(action.message.text).toEqual(message);
  });

  it('addXHRInterceptItem should return ADD_XHR_ITEM action.', () => {
    const payload = 'test';
    const expectedAction = {
      type: actions.ADD_XHR_ITEM,
      payload,
    };

    expect(actions.addXHRInterceptItem(payload)).toEqual(expectedAction);
  });

  it('setInitFlag should return SET_INIT_FLAG action.', () => {
    const flag = 'test';
    const expectedAction = {
      type: actions.SET_INIT_FLAG,
      flag,
    };

    expect(actions.setInitFlag(flag)).toEqual(expectedAction);
  });
});
