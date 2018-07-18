// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { connect } from 'react-redux';
import Shell from './component';
import { toggleShell,
  setShellPanelPosition,
  fetchAuthToken,
  requestAuthTokenTimeout,
  invalidateToken,
  setCurrentPath,
  logSiteInspectorTabChange,
  resetRouteUpdate,
  toggleDisableModal,
  logSiteInspectorDisable,
} from './actions';
import { removeMessage } from '../../shared/actions';
import authenticationStates from '../../shared/authenticationStates';

const mapStateToProps = state => ({
  authenticationState: state.ShellState.authenticationState,
  currentPath: state.ShellState.currentPath,
  customerCssPath: 'https://inspector.blob.core.windows.net/client/customer.css',
  messages: state.SharedState.messages,
  position: state.ShellState.position,
  tabs: state.ShellState.tabs,
  user: state.SharedState.user,
  visible: state.ShellState.visible,
  siteInspectorInitialized: state.SharedState.siteInspectorInitialized,
  routesUpdated: state.ShellState.routesUpdated,
  isVisibleDisableModal: state.ShellState.isVisibleDisableModal,
  siteInspectorEnabledFlightName: state.SharedState.siteInspectorEnabledFlightName,
  siteInspectorEnabledUrl: state.SharedState.siteInspectorEnabledUrl,
});

const mapDispatchToProps = dispatch => ({
  fetchAuthToken: (guid) => {
    dispatch(fetchAuthToken(guid));
      // Polling for tokens in token table
    let pollCount = 1;
    const pollInterval = setInterval(() => {
      if (pollCount >= 12) {
        dispatch(requestAuthTokenTimeout());
        clearInterval(pollInterval);
      } else {
        pollCount += 1;
        dispatch(fetchAuthToken(guid))
                  .then((response) => {
                      // if user is denied access or granted; do not poll
                    if (response &&
                          (response.authenticationState === authenticationStates.GRANTED
                              || response.authenticationState === authenticationStates.DENIED)) {
                      clearInterval(pollInterval);
                    }
                  });
      }
    }, 5000);
  },
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
  signOut: () => {
    dispatch(invalidateToken());
  },
  disableSiteInspector: (siFlightName) => {
    dispatch(toggleDisableModal());
    dispatch(logSiteInspectorDisable());
    window.siteInspector.onSubmitFlights([], [siFlightName]);
  },
  toggleDisableModal: () => {
    dispatch(toggleDisableModal());
  },
});

const ShellContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shell);

export default ShellContainer;
