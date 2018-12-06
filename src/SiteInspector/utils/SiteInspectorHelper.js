// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/* eslint import/prefer-default-export: "off" */
import config from '../shared/config';

export const getTabParameters = (tabId) => {
  let parameters;
  if (config.tabs && config.tabs.length && tabId) {
    const targetTab = config.tabs.filter(tab =>
          tab.id && tab.id.toUpperCase() === tabId.toUpperCase());
    parameters = targetTab.length && targetTab[0].parameters;
  }
  return parameters;
};

export const areArraysEqual = (array1, array2) => {
  if (!array1 && !array2) {
    return true;
  }

  if ((!array1 && array2) || (array1 && !array2) || array1.length !== array2.length) {
    return false;
  }

  for (let i = 0, l = array1.length; i < l; i += 1) {
        // Nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (!areArraysEqual(array1[i], array2[i])) {
        return false;
      }
    } else if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};

export function getConfigTabTitle(tabId) {
  if (config.tabs && config.tabs.length) {
    const targetTabs = config.tabs.filter(tab => tab.id === tabId);
    return targetTabs.length ? targetTabs[0].title : '';
  }
  return '';
}
