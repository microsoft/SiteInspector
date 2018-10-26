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

let previousHeight = '0px';

class ShellInspectorRouter extends React.Component {
  static renderTabComponent(tabComponent) {
    const ComponentToRender = tabComponent;
    return (<ComponentToRender />);
  }

  constructor(props) {
    super(props);

    this.state = {
      maxHeight: '100%',
    };

    this.updatePanelMaxHeight = this.updatePanelMaxHeight.bind(this);
  }

  componentDidMount() {
    this.updatePanelMaxHeight();
    window.addEventListener('resize', this.updatePanelMaxHeight);
  }

  shouldComponentUpdate(nextProps) {
    const result = nextProps.tabs !== this.props.tabs ||
      nextProps.initialPath !== this.props.initialPath ||
      this.state.maxHeight !== previousHeight ||
      (nextProps.routesUpdated && nextProps.routesUpdated !== this.props.routesUpdated);

    previousHeight = this.state.maxHeight;

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

  render() {
    const { tabs, initialPath, setPath } = this.props;
    return (<Router>
      <div className="flex-column">
        <div id="siPanelTabs" className="panel-tabs">
          <div className="si-group">
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
