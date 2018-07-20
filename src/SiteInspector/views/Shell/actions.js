// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export const TOGGLE_SHELL = 'TOGGLE_SHELL';
export const SET_CURRENT_PATH = 'SET_CURRENT_PATH';
export const SET_SHELL_PANEL_POSITION = 'SET_SHELL_PANEL_POSITION';
export const REGISTER_TAB = 'REGISTER_TAB';
export const RESET_ROUTE_UPDATE = 'RESET_ROUTE_UPDATE';

export const toggleShell = () => ({
  type: TOGGLE_SHELL,
});


export const setCurrentPath = path => ({
  type: SET_CURRENT_PATH,
  path,
});


export const setShellPanelPosition = position => ({
  type: SET_SHELL_PANEL_POSITION,
  position,
});

export const registerTab = tab => ({
  type: REGISTER_TAB,
  tab,
});

export const resetRouteUpdate = () => ({
  type: RESET_ROUTE_UPDATE,
});
