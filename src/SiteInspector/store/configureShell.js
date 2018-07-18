/* eslint  import/prefer-default-export: 'off' */
import moment from 'moment';
import assignIn from 'lodash.assignin';
import config from '../shared/config';
import store from './configureStore';
import initializeXHRInterceptor from '../interceptors/xhr';
import {
  registerTab,
} from '../views/Shell/actions';
import {
  setSharedStateConfigData,
  setInitFlag,
  signalUrlChange,
} from '../shared/actions';
import { transformLocalizationUrlTemplateIntoRegex } from '../shared/localization';

export const initializeShell = (overrideConfig) => {
  // Override default config with provided config and load into
  // redux state
  if (overrideConfig && Object.keys(overrideConfig).length) {
    // this needs to be done via a utils function
    // validate the overrideConfig object
    assignIn(config, overrideConfig);
      // expose the overriden config to user
    window.siteInspector.config = config;
  }
  store.dispatch(setSharedStateConfigData(config));

  let oldLocation = location.href;
  // Interval function runs ever second
  setInterval(() => {
    if (location.href !== oldLocation) {
      store.dispatch(signalUrlChange());
      oldLocation = location.href;
    }
  }, 1000);

  if (config && config.tabs) {
    config.tabs.forEach((tab) => {
      // Register tabs that are present in the config
      if (!Object.prototype.hasOwnProperty.call(tab, 'location') || !tab.location) {
        // Built-in tabs
        store.dispatch(registerTab(tab));
      } else {
        // Dynamic tabs
        const dynamicTabScriptId = `siteInspectorDynamicTab:${tab.id}`;

        if (!document.getElementById(dynamicTabScriptId)) {
          const dynamicTabScript = document.createElement('script');
          dynamicTabScript.id = dynamicTabScriptId;
          dynamicTabScript.src = tab.location;
          dynamicTabScript.type = 'text/javascript';
          dynamicTabScript.async = true;
          document.body.appendChild(dynamicTabScript);
        }
      }
    });
    }
    // By default Xhr interceptor is turned off; unless turned on by config
    if (Object.prototype.hasOwnProperty.call(config, 'interceptXhr') && config.interceptXhr === "true") {
        initializeXHRInterceptor();
    }

  store.dispatch(setInitFlag(true));
};
