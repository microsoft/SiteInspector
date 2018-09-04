// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import reducer from '../../shared/reducer';

describe('Shared reducers', () => {
  const defaultState = {
    siteInspectorInitialized: false,
    messages: [],
    xhrItems: [],
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState);
  });
});
