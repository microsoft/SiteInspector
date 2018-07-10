/* eslint  import/prefer-default-export: 'off' */
import moment from 'moment';
import assignIn from 'lodash.assignin';
import config from '../shared/config';
import store from './configureStore';
import {
  setTokenFromLocalStorage,
  registerTab,
  invalidateToken,
  setBuildVersion,
} from '../views/Shell/actions';
import {
  setSharedStateConfigData,
  setLocaleValues,
  setInitFlag,
  signalUrlChange,
} from '../shared/actions';
import { setAuthorizationHeader } from '../dal/SiteInspectorService';
import { isAuthExpired } from '../utils/SiteInspectorHelper';
import initializeXHRInterceptor from '../interceptors/xhr';
import initializeJSLLInterceptor from '../interceptors/jsll';
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

  // Setup metadata
  const buildVersion = process.env.BUILD_BUILDNUMBER ? process.env.BUILD_BUILDNUMBER : `localhost.${moment()}`;
  store.dispatch(setBuildVersion(buildVersion));

  let oldLocation = location.href;
  // Interval function runs ever second
  setInterval(() => {
    // Check if auth needs to be expired
    if (store.getState().SharedState.sifd.token &&
        store.getState().ShellState.authenticationSuccessTime &&
        isAuthExpired(store.getState().ShellState.authenticationSuccessTime)) {
      store.dispatch(invalidateToken());
    }
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
        const dynamicTabScriptId = `siteInspectorDynamicTabComponent:${tab.id}`;

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

  // If valid token in local storage, set state to GRANTED
  if (typeof Storage !== 'undefined' && typeof localStorage !== 'undefined') {
    const authToken = localStorage.getItem('siteInspectorFDtoken');
    if (authToken) {
      const values = authToken.split(',');
      if (values.length === 3) {
        const authSuccessTime = parseInt(values[2], 10);
        if (!isAuthExpired(authSuccessTime)) {
          setAuthorizationHeader(values[0]);
          store.dispatch(setTokenFromLocalStorage({
            token: values[0],
            user: values[1],
            authenticationSuccessTime: authSuccessTime,
          }));
        }
      }
    }
  }

  // Set locale values
  let locale = '';
  if (config.localizationUrlTemplate) {
    const localeRegex =
      transformLocalizationUrlTemplateIntoRegex(config.localizationUrlTemplate);
    const localeMatches = localeRegex.exec(window.location.href);
    if (localeMatches && localeMatches.length === 4) {
      locale = localeMatches[2];
    }
  }
  store.dispatch(setLocaleValues(locale));

  store.dispatch(setInitFlag(true));
};

// Interceptors are turned on by default
// Logic to turn off either via config or after all tabs have been loaded will come in later
initializeXHRInterceptor();
initializeJSLLInterceptor();
