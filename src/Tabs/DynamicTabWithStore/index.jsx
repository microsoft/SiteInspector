// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import config from './shared/config';
import DynamicTabContainer from './views/container';
import DynamicTabReducer from './views/reducer';

require('./stylesheets/main.scss');

window.siteInspector.registerCustomTab({
  id: config.id,
  label: config.defaultTitle,
  stateNamespace: config.stateNamespace,
  component: DynamicTabContainer,
  reducerMap: {
    [config.stateNamespace]: DynamicTabReducer,
  },
});
