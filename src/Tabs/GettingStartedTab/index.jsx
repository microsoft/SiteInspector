// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import config from './shared/config';
import CustomTabContainer from './views/container';
import CustomTabReducer from './views/reducer';

require('./stylesheets/main.scss');

window.siteInspector.registerCustomTab({
  id: config.id,
  label: config.defaultTitle,
  stateNamespace: config.stateNamespace,
  component: CustomTabContainer,
  reducerMap: {
    [config.stateNamespace]: CustomTabReducer,
  },
});
