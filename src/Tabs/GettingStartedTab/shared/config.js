// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import assignIn from 'lodash.assignin';

const config = {
  defaultTitle: 'My First Tab',
  id: 'gettingstartedtab',
  stateNamespace: 'CustomTabState',
};

// This is used to pass parameters to the tab from the parent config object.
export const setParameters = (overrideConfig) => {
  if (overrideConfig && Object.keys(overrideConfig).length) {
    assignIn(config, overrideConfig);
  }
};

export default config;
