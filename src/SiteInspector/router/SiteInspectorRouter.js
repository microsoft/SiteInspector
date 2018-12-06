// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import {
    MemoryRouter as Router,
    Route,
    NavLink,
    Redirect,
    Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import routes from './routes';
import TabScroller from '../shared/components/TabScroller';

let previousHeight = '0px';
let previousShowLeftScroll = false;
let previousShowRightScroll = false;

class ShellInspectorRouter extends React.Component {
  static renderTabComponent(tabComponent) {
    const ComponentToRender = tabComponent;
    return (<ComponentToRender />);
  }

  constructor(props) {
    super(props);

    this.state = {
      maxHeight: '100%',
      leftOnscreenTab: 0,
      showLeftScroll: false,
      showRightScroll: true,
      scrollAreaLeft: 0,
    };

    this.updatePanelMaxHeight = this.updatePanelMaxHeight.bind(this);
    this.tabScrollArea = React.createRef();
  }

  componentDidMount() {
    this.updatePanelMaxHeight();
    window.addEventListener('resize', this.updatePanelMaxHeight);
  }

  shouldComponentUpdate(nextProps) {
    const result = nextProps.tabs !== this.props.tabs ||
      nextProps.initialPath !== this.props.initialPath ||
      this.state.maxHeight !== previousHeight ||
      (nextProps.routesUpdated && nextProps.routesUpdated !== this.props.routesUpdated) ||
      this.state.showLeftScroll !== previousShowLeftScroll ||
      this.state.showRightScroll !== previousShowRightScroll;

    previousHeight = this.state.maxHeight;
    previousShowLeftScroll = this.state.showLeftScroll;
    previousShowRightScroll = this.state.showRightScroll;

    return result;
  }

  componentDidUpdate() {
    this.props.resetRouteUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePanelMaxHeight);
  }

  updatePanelMaxHeight() {
    const documentElement = document.documentElement;
    const body = document.getElementsByTagName('body')[0];
    const windowHeight = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    const panelTabsHeight = document.getElementById('siPanelTabs').offsetHeight;
    const headerHeight = document.getElementById('siHeader').offsetHeight;
    const height = windowHeight - panelTabsHeight - headerHeight;

    this.setState({ maxHeight: height });
  }

  scrollTabs = (direction) => {
    const scrollArea = this.tabScrollArea.current;

    if (!scrollArea) {
      return;
    }

    const tabCount = scrollArea.childNodes.length;

    if (tabCount === 0) {
      return;
    }

    let leftOnscreenTab = this.state.leftOnscreenTab;
    const leftPadding = scrollArea.children[0].offsetLeft;
    const lastTab = scrollArea.children[tabCount - 1];
    const lastTabRightEdge = lastTab.offsetLeft + lastTab.offsetWidth;

    if (direction === 'right') {
      leftOnscreenTab += 2;

      if (leftOnscreenTab >= tabCount - 2) {
        leftOnscreenTab = tabCount - 2;
      }

      const areaLeft = (0 - scrollArea.children[leftOnscreenTab].offsetLeft) + leftPadding;

      this.setState({
        scrollAreaLeft: areaLeft,
        leftOnscreenTab,
        showRightScroll: (leftOnscreenTab < tabCount - 2 &&
          lastTabRightEdge + areaLeft > (scrollArea.offsetWidth + (leftPadding * 2))),
        showLeftScroll: true,
      },
      () => { this.forceUpdate(); },
      );
    }

    if (direction === 'left') {
      leftOnscreenTab -= 2;

      if (leftOnscreenTab < 0) {
        leftOnscreenTab = 0;
      }

      this.setState({
        scrollAreaLeft: (0 - scrollArea.children[leftOnscreenTab].offsetLeft) + leftPadding,
        leftOnscreenTab,
        showRightScroll: true,
        showLeftScroll: leftOnscreenTab !== 0,
      },
      () => { this.forceUpdate(); },
      );
    }
  };

  render() {
    const { tabs, initialPath, setPath } = this.props;
    const lastTab = this.tabScrollArea.current && this.tabScrollArea.current.childNodes.length > 0 ?
      this.tabScrollArea.current.children[this.tabScrollArea.current.childNodes.length - 1] : null;
    const needScroller = lastTab
      ? this.tabScrollArea.current && lastTab &&
        ((lastTab.offsetWidth + lastTab.offsetLeft) - this.tabScrollArea.current.offsetWidth > 0)
      : false;
    const leftStyle = {
      left: `${this.state.scrollAreaLeft}px`,
    };

    return (<Router>
      <div className="flex-column">
        <div id="siPanelTabs" className={`panel-tabs ${needScroller && 'with-scroll'}`}>
          <div className={`si-group ${this.state.scrollAreaLeft < 0 && 'with-scroll-left'}`} ref={this.tabScrollArea} style={leftStyle}>
            {tabs.map((tab) => {
              const route = routes.find(r => r.id.toUpperCase() === tab.toUpperCase());
              return route
                ? <NavLink
                  key={tab}
                  exact
                  className="si-tab-anchor si-select-button"
                  to={route.path}
                  activeClassName="active"
                  onClick={() => setPath(route.path)}
                >{route.label}</NavLink>
                : null;
            })}
          </div>
          <TabScroller
            direction="left"
            onScroll={d => this.scrollTabs(d)}
            isVisible={needScroller && this.state.showLeftScroll}
          />
          <TabScroller
            direction="right"
            onScroll={d => this.scrollTabs(d)}
            isVisible={needScroller && this.state.showRightScroll}
          />
        </div>
        <div className="panel-content" style={{ maxHeight: this.state.maxHeight }}>
          <Switch>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                render={() => ShellInspectorRouter.renderTabComponent(route.component)}
              />
            ))}
          </Switch>
          {initialPath
              ? <Redirect to={initialPath} />
                    : tabs.length
                        ? setPath(routes.find(r =>
                            r.id.toUpperCase() === tabs[0].toUpperCase()).path)
                        : null}
        </div>
      </div>
    </Router>);
  }
}

ShellInspectorRouter.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialPath: PropTypes.string.isRequired,
  setPath: PropTypes.func.isRequired,
  resetRouteUpdate: PropTypes.func.isRequired,
  routesUpdated: PropTypes.bool.isRequired,
};

export default ShellInspectorRouter;
