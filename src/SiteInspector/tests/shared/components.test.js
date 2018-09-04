// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Blade from '../../shared/components/Blade';
import Chip from '../../shared/components/Chip';
import ListItem from '../../shared/components/ListItem';
import MessageBar from '../../shared/components/MessageBar';
import Modal from '../../shared/components/Modal';
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

  describe('Chip component', () => {
    let chip;

    beforeEach(() => {
      chip = shallow(<Chip
        extraClassNames={null}
        glyph="glyph"
        title="test title"
        href="#"
        target="_blank"
      />);
    });

    it('should be created', () => {
      expect(chip.length).toEqual(1);
    });

    it('should be rendered properly', () => {
      expect(chip).toMatchSnapshot();
    });
  });

  describe('ListItem component', () => {
    let listItem;

    beforeEach(() => {
      listItem = shallow(<ListItem
        content={<div>test</div>}
      />);
    });

    it('should be created', () => {
      expect(listItem.length).toEqual(1);
    });

    it('should be rendered properly', () => {
      expect(listItem).toMatchSnapshot();
    });
  });

  describe('MessageBar component', () => {
    let msgBar;
    const testMsg = {
      isCollapsing: false,
      key: 'test',
      text: 'test message',
      type: 1,
      timeout: 10,
    };

    beforeEach(() => {
      msgBar = shallow(<MessageBar
        messages={[testMsg]}
        removeMessage={jest.fn()}
      />);
    });

    it('should be created', () => {
      expect(msgBar.length).toEqual(1);
    });

    it('should be rendered properly', () => {
      expect(msgBar).toMatchSnapshot();
    });
  });

  describe('Modal component', () => {
    let modal;

    beforeEach(() => {
      modal = shallow(<Modal
        title="test title"
        closeHandler={jest.fn()}
        displayUI={<div>test</div>}
        isLargerWidth={false}
      />);
    });

    it('should be created', () => {
      expect(modal.length).toEqual(1);
    });

    it('should be rendered properly', () => {
      expect(modal).toMatchSnapshot();
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
