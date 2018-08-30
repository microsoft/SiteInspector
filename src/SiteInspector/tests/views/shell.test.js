// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import configureStore from 'redux-mock-store';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShellContainer from '../../views/Shell/container';

describe('Shell view tests', () => {
  const initialState = {
    ShellState: {
      currentPath: '',
      position: 'right',
      tabs: [],
      visible: false,
      routesUpdated: false,
    },
    SharedState: {
      siteInspectorInitialized: true,
    },
  };
  const mockStore = configureStore();
  let store;
  let shell;

  configure({ adapter: new Adapter() });

  beforeEach(() => {
    store = mockStore(initialState);
    shell = shallow(<ShellContainer store={store} />);
  });

  it('Container was created', () => {
    expect(shell.length).toEqual(1);
  });

  it('SiteInspector rendered properly', () => {
    expect(shell).toMatchSnapshot();
  });
});
