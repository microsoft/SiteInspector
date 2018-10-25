// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// eslint-disable-next-line import/no-unresolved, import/extensions
import { addErrorMessage } from 'site-inspector-actions';

export const CAPTURE_SCREEN = 'CAPTURE_SCREEN';
export const CAPTURE_SCREEN_FAIL = 'CAPTURE_SCREEN_FAIL';

export const captureScreenshotFail = () => (dispatch) => {
  dispatch(addErrorMessage('Failed to capture the screen'));
  return {
    type: CAPTURE_SCREEN_FAIL,
  };
};

export const captureScreenshot = capture => ({
  type: CAPTURE_SCREEN,
  capture,
});
