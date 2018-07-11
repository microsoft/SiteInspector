import React from 'react';
import ReactDOM, { render } from 'react-dom';
import PropTypes from 'prop-types';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import './utils/polyfills';
import store, { injectAsyncReducer } from './store/configureStore';
import ShellContainer from './views/Shell/container';
import { initializeShell } from './store/configureShell';
import * as SiteInspectorUI from './shared/SiteInspectorUI';
import * as actions from './shared/actions';
import { registerTab } from './views/Shell/actions';
import Fluent from './shared/components/FluentWeb';
import { getTabParameters } from './utils/SiteInspectorHelper';

require('./stylesheets/main.scss');

// Create dom element on which Site-Inspector will be mounted.
const target = document.createElement('div');
target.setAttribute('id', 'site-inspector');
target.setAttribute('class', 'site-inspector');
document.body.appendChild(target);

let isNotSupportedIE = false;

// User agent check for detecting IE
const ua = window.navigator.userAgent;
if ((ua.indexOf('MSIE ') > -1) || (ua.indexOf('Trident/') > -1)) {
  isNotSupportedIE = true;
}
// Another check for detecting IE
if (!Object.assign) {
  isNotSupportedIE = true;
}
// Check if IE11 (IE11 is supported)
if (!!window.MSInputMethodContext && !!document.documentMode) {
  isNotSupportedIE = false;
}

if (!isNotSupportedIE) {
  // Set globals
  window.siteInspector = {
    init: initializeShell,
    registerCustomTab(tab) {
      if (tab.reducerMap) {
        injectAsyncReducer(store, tab.reducerMap);
      }
      if (tab.init) {
        const parameters = getTabParameters(tab.id);
        tab.init(parameters);
      }
      store.dispatch(registerTab(tab));
      if (tab.initAction) {
        store.dispatch(tab.initAction());
      }
    },
    // Provided for dynamically loaded components to use
    actions,
    Fluent,
    PropTypes,
    React,
    ReactDOM,
    Redux,
    ReactRedux,
    SiteInspectorUI,
  };

  render(
    <ReactRedux.Provider store={store}>
      <ShellContainer />
    </ReactRedux.Provider>,
    document.getElementById('site-inspector'),
  );
} else {
  window.siteInspector = {
    init() { },
  };
  console.log('SiteInspector is not supported on this version of IE (only IE 11 is supported).');
}
