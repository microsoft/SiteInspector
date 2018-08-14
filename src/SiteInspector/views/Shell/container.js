// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { connect } from 'react-redux';
import Shell from './component';
import { toggleShell,
  setShellPanelPosition,
  setCurrentPath,
  resetRouteUpdate,
  logSiteInspectorTabChange,
} from './actions';
import { removeMessage } from '../../shared/actions';

const mapStateToProps = state => ({
  currentPath: state.ShellState.currentPath,
  messages: state.SharedState.messages,
  position: state.ShellState.position,
  tabs: state.ShellState.tabs,
  visible: state.ShellState.visible,
  siteInspectorInitialized: state.SharedState.siteInspectorInitialized,
  routesUpdated: state.ShellState.routesUpdated,
});

const mapDispatchToProps = dispatch => ({
  onToggleShell: () => {
    dispatch(toggleShell());
  },
  removeMessage: (messageKey) => {
    dispatch(removeMessage(messageKey));
  },
  resetRouteUpdate: () => {
    dispatch(resetRouteUpdate());
  },
  setCurrentPath: (path) => {
    dispatch(logSiteInspectorTabChange(path));
    dispatch(setCurrentPath(path));
  },
  setShellPanelPosition: (position) => {
    dispatch(setShellPanelPosition(position));
  },
});

const ShellContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shell);

export default ShellContainer;
