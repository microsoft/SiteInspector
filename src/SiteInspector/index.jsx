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
import { eventProcessor } from './interceptors/jsll';
import Fluent from './shared/components/FluentWeb';
import { getTabParameters } from './utils/SiteInspectorHelper';
import {
    getClickstreamTaggedElements,
    getClickstreamTag,
    getProperty,
    checkForProperty,
    setProperty,
} from './utils/jsllDQHelpers';
import {
    EVENT_NAMES,
    ASSET_TYPES,
    ISSUE_TYPES,
    SEVERITY_TYPES,
    EXTERNAL,
    STATUS,
} from './utils/jsllDQConfig';

require('./stylesheets/main.scss');

// Add a div with id of site-inspector to the client. The Inspector Shell will render to that div.
const target = document.createElement('div');
target.setAttribute('id', 'site-inspector');
target.setAttribute('class', 'site-inspector');
target.setAttribute('data-bi-dnt', 'true');
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
    eventProcessor,
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

    // Exposes the ability to get the jsll dq issues on this page programatically
    // Once complete the jsllViewerState.jsllDQResultsDataByType data
    // is passed in as input to the callback as input
    getJsllDQResults(callback = null, ruleUpdates) {
      store.dispatch(actions.updateJsllDQRulesAction(ruleUpdates));
      store.dispatch(actions.getJsllDQResults(callback));
      return store.getState().SharedState.jsll.jsllDQRulesChangeLog;
    },

    getJsllDQIssues(callback = null, ruleUpdates) {
      store.dispatch(actions.updateJsllDQRulesAction(ruleUpdates));
      store.dispatch(actions.getJsllDQResults(callback, true));
      return store.getState().SharedState.jsll.jsllDQRulesChangeLog;
    },

    getJsllDQRules() {
      return store.getState().SharedState.jsll.jsllDQRules;
    },

    // Example of rule edit and creation
    //
    // function displayResults(input){var element = console.log(JSON.stringify(input));}
    //
    // window.siteInspector.getJsllDQResults(displayResults,
        // [
        //    {
        //        id: "ID_NO_PAGE_NAME",
        //        sevType: window.siteInspector.jsllDQConstants.SEVERITY_TYPES.warning
        //    },
        //    {
        //        id: "ID_NO_ACTION_TYPE",
        //        sevType: window.siteInspector.jsllDQConstants.SEVERITY_TYPES.warning
        //    },
        //    {
        //        id: "JuansNewRule",
        //        run: () => {
        //            return true;
        //        }
        //    }
        // ]
     // )

    // Exposes resources that can be useful for partners that author their
    // own jsll DQ tests.
    jsllDQConstants: {
      EVENT_NAMES,
      ASSET_TYPES,
      ISSUE_TYPES,
      SEVERITY_TYPES,
      EXTERNAL,
      STATUS,
    },

    jsllDQHelpers: {
      getClickstreamTaggedElements,
      getClickstreamTag,
      getProperty,
      checkForProperty,
      setProperty,
    },
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
