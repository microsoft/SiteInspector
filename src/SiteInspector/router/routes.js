// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ContactViewerContainer from '../views/Contact/container';
/* Route for built-in Contact Us tab
 * 
*/
const routes = [
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    component: ContactViewerContainer,
    state: 'ContactViewerState',
  },
];

export default routes;
