// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import constants from '../shared/constants';

const localStorageStateKey = 'siteinspectorstate';

/**
 * Deletes state from local storage
 */
export const deleteState = () => {
  try {
    localStorage.removeItem(localStorageStateKey);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
};

/**
 * Loads state from local storage
 */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(localStorageStateKey);
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);

    return parsedState;
  } catch (err) {
    return undefined;
  }
};

/**
 * Saves state to local storage
 * @param  {Object} state
 */
export const saveState = (states, activeState) => {
  try {
    const cachedState = {};
    Object.keys(states).forEach((state) => {
      if (constants.cachedStates.indexOf(state) !== -1 || state === activeState) {
        cachedState[state] = states[state];
      }
    });
    const serializedState = JSON.stringify(cachedState);
    localStorage.setItem(localStorageStateKey, serializedState);
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
};
