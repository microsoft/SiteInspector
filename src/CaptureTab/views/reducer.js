// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CAPTURE_SCREEN, CAPTURE_SCREEN_FAIL } from './actions';

export const initialState = {
  capture: null,
};

const CaptureTabReducer = (state = initialState, action) => {
  switch (action.type) {
    case CAPTURE_SCREEN_FAIL:
      return {
        ...state,
        capture: null,
      };
    case CAPTURE_SCREEN:
      return {
        ...state,
        capture: action.capture,
      };
    default:
      return state;
  }
};

export default CaptureTabReducer;
