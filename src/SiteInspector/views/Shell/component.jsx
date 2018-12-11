// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import PropTypes from 'prop-types';
import config from '../../shared/config';
import SiteInspectorRouter from '../../router/SiteInspectorRouter';
import ActionMenu from '../../shared/components/ActionMenu';

// eslint-disable-next-line
const SITab = require('-!babel-loader!svg-react-loader!../../assets/SITab.svg');

const Logo = config.logo
  ? config.logo
  // eslint-disable-next-line
    : require('-!babel-loader!svg-react-loader!../../assets/SILogo.svg');

const Shell = ({ siteInspectorInitialized, currentPath, position,
    tabs, visible, onToggleShell, setCurrentPath, setShellPanelPosition,
    resetRouteUpdate, routesUpdated }) => {
  const attachCustomToggle = () => {
    const elem = document.getElementById(config.toggleElementId);
    if (elem && elem.className.indexOf('si-attached') === -1) {
      elem.addEventListener('click', onToggleShell, false);
      // prevent multiple events from attaching
      elem.className += ' si-attached';
    }
    return elem !== null;
  };

  return (
        siteInspectorInitialized ? <div className="shell-panel">
          {attachCustomToggle() ||
          <div className="shell-client-tab-container shadow">
            <a className="shell-client-tab" onClick={onToggleShell} href="javascript:void(0)">
              <SITab className="shell-icon-glass" />
              {typeof Logo === 'string'
                ? <img className="shell-icon" src={Logo} alt="Product logo" />
                : <Logo className="shell-icon" />
              }
            </a>
          </div>
          }
          <div className={`panel flex-column ${visible ? 'visible' : ''} ${position}`}>
            <div id="siHeader" className="header">
              <div className="si-header-left">
                <a href={config.aboutUrl} target="_blank" rel="noopener noreferrer">
                  {typeof Logo === 'string'
                    ? <img className="panel-icon normal" src={Logo} alt="Product logo" />
                    : <Logo className="panel-icon" />
                  }
                </a>
                <div className="si-header-title">{config.title}</div>
              </div>
              <div className="si-header-right">
                <ActionMenu
                  actionTrigger={(<span className="si-glyph si-glyph-settings" />)}
                  menu={[{
                    content: `Position ${position === 'right' ? 'Left' : 'Right'}`,
                    onClick: () => { setShellPanelPosition(position === 'right' ? 'left' : 'right'); },
                    id: 'siMenuPosition',
                  }, {
                    content: 'About',
                    onClick: () => { window.open(config.aboutUrl); },
                    id: 'siMenuAbout',
                  }]}
                />
                <div title="Close StoreInspector" className="si-panel-glyph">
                  <span className="si-glyph si-glyph-cancel" aria-hidden="true" onClick={onToggleShell} />
                </div>
              </div>
            </div>
            <div className="panel-content-wrapper flex-column">
              <SiteInspectorRouter
                tabs={tabs}
                initialPath={currentPath}
                setPath={setCurrentPath}
                routesUpdated={routesUpdated}
                resetRouteUpdate={resetRouteUpdate}
              />
            </div>
          </div>
        </div>
            : null);
};

Shell.propTypes = {
  currentPath: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  visible: PropTypes.bool.isRequired,
  onToggleShell: PropTypes.func.isRequired,
  setCurrentPath: PropTypes.func.isRequired,
  setShellPanelPosition: PropTypes.func.isRequired,
  siteInspectorInitialized: PropTypes.bool.isRequired,
  resetRouteUpdate: PropTypes.func.isRequired,
  routesUpdated: PropTypes.bool.isRequired,
};

export default Shell;
