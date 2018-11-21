// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import configureStore from 'redux-mock-store';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ShellContainer from '../../views/Shell/container';
import config from '../../shared/config';

describe('Primary container view tests', () => {
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
  let container;
  let shell;

  configure({ adapter: new Adapter() });

  beforeEach(() => {
    // suppress react import warning
    console.error = jest.fn();

    config.title = 'SI Test';

    store = mockStore(initialState);
    container = shallow(<ShellContainer store={store} />);
  });

  it('Container was created', () => {
    expect(container.length).toEqual(1);
  });

  it('SiteInspector rendered properly', () => {
    expect(container).toMatchSnapshot();
  });

  describe('Shell component tests', () => {
    beforeEach(() => {
      store = mockStore(initialState);
      container = shallow(<ShellContainer store={store} />);
      shell = container.dive();
    });

    it('Shell is created', () => {
      expect(shell.length).toEqual(1);
    });

    it('Tab is rendered', () => {
      expect(shell.find('.shell-client-tab').length).toEqual(1);
    });

    it('Panel is rendered', () => {
      const panel = shell.find('.panel');
      expect(panel.length).toEqual(1);
      expect(panel.hasClass('visible')).toBeFalsy();
      expect(panel).toMatchSnapshot();
    });

    it('Panel visbility is toggled after click', () => {
      const panel = shell.find('.panel');
      shell.find('.shell-client-tab').simulate('click');
      setTimeout(() => {
        expect(panel.hasClass('visible')).toBeTruthy();
        shell.find('.shell-client-tab').simulate('click');
        setTimeout(() => {
          expect(panel.hasClass('visible')).toBeFalsy();
        }, 1500);
      }, 1500);
    });

    it('Panel has router', () => {
      const panel = shell.find('.panel');
      expect(panel.find('ShellInspectorRouter').length).toEqual(1);
    });

    it('Panel has menu', () => {
      const panel = shell.find('.panel');
      expect(panel.find('.si-header-right').length).toEqual(1);
      const menu = panel.find('.si-header-right');
      expect(menu.find('ActionMenu').length).toEqual(1);
    });

    it('Panel has correct title', () => {
      const panel = shell.find('.panel');
      const title = panel.find('.si-header-title');
      expect(title.length).toEqual(1);
      expect(title.text()).toEqual('SI Test');
    });
  });
});
