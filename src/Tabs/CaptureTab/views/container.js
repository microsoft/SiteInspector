// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { connect } from 'react-redux';
import config from '../shared/config';
import { captureScreenshot, captureScreenshotFail } from './actions';
import CaptureViewer from './component';

const mapStateToProps = state => ({
  preview: state[config.stateNamespace].capture,
});

const mapDispatchToProps = dispatch => ({
  captureScreenshot: image => dispatch(captureScreenshot(image)),
  captureFail: () => dispatch(captureScreenshotFail()),
});

const CaptureViewerContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CaptureViewer);

export default CaptureViewerContainer;
