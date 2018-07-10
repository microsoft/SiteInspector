import fetch from 'isomorphic-fetch';
import environment from '../shared/environment';
import store from '../store/configureStore';
import { isAuthExpired } from '../utils/SiteInspectorHelper';

const SITE_INSPECTOR_FD_HOSTNAME = environment.siteInspectorFDUrl;

const options = {};

export function setAuthorizationHeader(bearerToken) {
  options.headers = { Authorization: `Bearer ${bearerToken}` };
}

function tryAddAuthHeader() {
  if (typeof localStorage !== 'undefined' && !options.headers) {
        // set the auth header
    const sifdTokenValue = localStorage.getItem('siteInspectorFDtoken');
    if (sifdTokenValue) {
      const values = sifdTokenValue.split(',');
      if (values.length === 3) {
        const authExpirationTime = parseInt(values[2], 10);
        if (!isAuthExpired(authExpirationTime)) {
          setAuthorizationHeader(values[0]);
        }
      }
    }
  }
}

export function submitLog(logName, logProperties = {}) {
  const data = JSON.stringify({ ...logProperties, currentUser: store.getState().SharedState.user || 'unknown' });
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/logging/${logName}`,
      { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
}

export const fetchAuthenticationToken = function (guid) {
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/token/${guid}`);
};

export function fetchBugs(areaPath) {
  // This is required to pass a path param with backslash
  areaPath = areaPath.replace(/\\/gi, '_');
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/vso/getbugs/${areaPath}`, options);
}

export function submitBug(data) {
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/vso/filebug`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers),
  });
}

export function cleanTokenData(session) {
  tryAddAuthHeader();
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/token/clean/${session}`, { method: 'PUT', headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers) });
}

export function fetchScripts(url, appId) {
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/script?url=${url}&appId=${appId || window.location.hostname}`, options);
}

export function uploadScriptData(scriptData) {
  if (!scriptData.appId) { scriptData.appId = window.location.hostname; }
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/script`, { method: 'POST', body: JSON.stringify(scriptData), headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers) });
}

export function updateScriptData(scriptData) {
  if (!scriptData.appId) { scriptData.appId = window.location.hostname; }
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/script`, { method: 'PUT', body: JSON.stringify(scriptData), headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers) });
}

export function deleteScriptData(scriptData) {
  if (!scriptData.appId) { scriptData.appId = window.location.hostname; }
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/script`, { method: 'DELETE', body: JSON.stringify(scriptData), headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers) });
}

export function fetchScriptUploadUri(blobId = '') {
  return fetch(`${SITE_INSPECTOR_FD_HOSTNAME}/v1/script/uploaduri?blobId=${blobId}`, options);
}

export function uploadBlob(sasUri, content) {
  return fetch(sasUri, { method: 'POST', body: content, headers: { 'x-ms-blob-type': 'BlockBlob' } });
}
