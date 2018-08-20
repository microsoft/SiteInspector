// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { combineReducers } from 'redux';
import ShellReducer from '../views/Shell/reducer';
import SharedReducer from '../shared/reducer';

export default function createMainReducer(asyncReducers) {
  return combineReducers({
    ShellState: ShellReducer,
    SharedState: SharedReducer,
    ...asyncReducers,
  });
}
