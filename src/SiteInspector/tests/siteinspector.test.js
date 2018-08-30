// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const index = require('..');

describe('SiteInspector tests', () => {
  it('SiteInspector script was loaded', () => {
    expect(index).toBeTruthy();
    expect(window.siteInspector).toBeTruthy();
  });
});
