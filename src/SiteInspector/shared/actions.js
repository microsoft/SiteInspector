// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_XHR_ITEM = 'ADD_XHR_ITEM';
export const COLLAPSE_MESSAGE = 'COLLAPSE_MESSAGE';
export const SET_INIT_FLAG = 'SET_INIT_FLAG';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';

export function addErrorMessage(text) {
    return function start(dispatch) {
        dispatch(addMessage({
            text,
            type: MessageBarType.error,
        }));
    };
}

export function addXHRInterceptItem(payload) {
    return {
        type: ADD_XHR_ITEM,
        payload,
    };
}

export function addMessage(message) {
    if (typeof message === 'string') {
        message = {
            text: message,
            timeout: 5000,
            type: MessageBarType.info,
        };
    }

    return function start(dispatch) {
        if (message && !message.key) {
            message.key = Math.random().toString(36).substring(7);
        }

        if (message.timeout && message.timeout > 0) {
            setTimeout(() => {
                dispatch(collapseMessage(message.key));
            }, message.timeout);

            setTimeout(() => {
                dispatch(removeMessage(message.key));
            }, message.timeout + 750);
        }

        dispatch({
            type: ADD_MESSAGE,
            message,
        });
    };
}

export function collapseMessage(messageKey) {
  return {
    type: COLLAPSE_MESSAGE,
    messageKey,
  };
}

export function removeMessage(messageKey) {
  return {
    type: REMOVE_MESSAGE,
    messageKey,
  };
}

export function setInitFlag(flag) {
    return {
        type: SET_INIT_FLAG,
        flag,
    }
}