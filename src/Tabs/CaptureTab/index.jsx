// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import config, { setParameters } from './shared/config';
import CaptureTabContainer from './views/container';
import CaptureTabReducer from './views/reducer';

require('./stylesheets/main.scss');

window.siteInspector.registerCustomTab({
  id: config.id,
  label: config.defaultTitle,
  stateNamespace: config.stateNamespace,
  component: CaptureTabContainer,
  reducerMap: {
    [config.stateNamespace]: CaptureTabReducer,
  },
  init: setParameters,
});
