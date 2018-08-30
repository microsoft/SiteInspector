// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import reducer from '../../shared/reducer';
import * as actions from '../../shared/actions';

describe('Shared reducers', () => {
  const testMessageKey = Math.random().toString(36).substring(7);

  const testMessage = {
    test: 'test message',
    timeout: 0,
    type: 0,
    key: testMessageKey,
  };

  let defaultState;

  beforeEach(() => {
    defaultState = {
      siteInspectorInitialized: false,
      messages: [],
      xhrItems: [],
    };
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState);
  });

  it('should handle ADD_MESSAGE', () => {
    const addMessage = {
      type: actions.ADD_MESSAGE,
      message: testMessage,
    };

    const expectedState = {
      ...defaultState,
      messages: [addMessage.message],
    };

    expect(reducer(defaultState, addMessage)).toEqual(expectedState);
  });

  it('should handle ADD_XHR_ITEM', () => {
    const addXhrItem = {
      type: actions.ADD_XHR_ITEM,
      payload: 'test',
    };

    const expectedState = {
      ...defaultState,
      xhrItems: [addXhrItem.payload],
    };

    expect(reducer(defaultState, addXhrItem)).toEqual(expectedState);
  });

  it('should handle COLLAPSE_MESSAGE', () => {
    const collapseMessage = {
      type: actions.COLLAPSE_MESSAGE,
      messageKey: testMessageKey,
    };

    const expectedState = {
      ...defaultState,
      messages: [
        {
          ...testMessage,
          isCollapsing: true,
        },
      ],
    };

    defaultState = {
      ...defaultState,
      messages: [testMessage],
    };

    expect(reducer(defaultState, collapseMessage)).toEqual(expectedState);
  });
});
