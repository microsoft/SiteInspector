// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Blade from '../../shared/components/Blade';
import Tab from '../../shared/components/Tab';
import TabNavigation from '../../shared/components/TabNavigation';

configure({ adapter: new Adapter() });

describe('Shared components', () => {
  describe('Blade component', () => {
    let blade;

    beforeEach(() => {
      blade = shallow(<Blade
        title="test title"
        closeHandler={jest.fn()}
        displayUI={<div>hello world</div>}
        isLargerWidth={false}
      />);
    });

    it('should be created', () => {
      expect(blade.length).toEqual(1);
    });

    it('should be rendered properly', () => {
      expect(blade).toMatchSnapshot();
    });
  });

  describe('Tab component', () => {
    let tab;
    const tabData = {
      id: 'test',
      label: 'test label',
    };

    beforeEach(() => {
      tab = shallow(<Tab
        tab={tabData}
        setViewer={jest.fn()}
      />);
    });

    it('should be created', () => {
      expect(tab.length).toEqual(1);
    });

    it('should be rendered properly', () => {
      expect(tab).toMatchSnapshot();
    });
  });

  describe('TabNavigation component', () => {
    let tabNav;
    const tabData = {
      id: 'test',
      label: 'test label',
      view: <div>test</div>,
    };

    beforeEach(() => {
      tabNav = shallow(<TabNavigation
        tabs={{ test: tabData }}
        activeTab="test"
        setTab={jest.fn()}
      />);
    });

    it('should be created', () => {
      expect(tabNav.length).toEqual(1);
    });

    it('should be rendered properly', () => {
      expect(tabNav).toMatchSnapshot();
    });
  });
});
