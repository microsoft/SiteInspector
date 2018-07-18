// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SET_INIT_FLAG } from '../../shared/actions';
import { getTabParameters } from '../../utils/SiteInspectorHelper';

const getParameterByName = (name) => {
  const parameters = getTabParameters('contact');
  return (parameters && parameters[name]) || undefined;
};

export const initialState = {
  title: 'SiteInspector',
  email: 'storeinspector@microsoft.com',
};

const ContactViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INIT_FLAG: {
      if (action.flag) {
        return {
          ...state,
          title: (getParameterByName('title') || state.title),
          email: (getParameterByName('email') || state.email),
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export default ContactViewerReducer;
