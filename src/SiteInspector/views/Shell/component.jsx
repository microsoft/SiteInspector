// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import PropTypes from 'prop-types';
import { ActionMenu } from '../../shared/components/FluentWeb';
import config from '../../shared/config';
import SiteInspectorRouter from '../../router/SiteInspectorRouter';
import authenticationStates from '../../shared/authenticationStates';
import Spinner from '../../shared/components/Spinner';
import AuthenticationLink from '../../shared/components/AuthenticationLink';
import UserAccount from '../../shared/components/UserAccount';
import Modal from '../../shared/components/Modal';

// eslint-disable-next-line
const SITab = require('-!babel-loader!svg-react-loader!../../assets/SITab.svg');

const Logo = config.logo
  ? config.logo
  // eslint-disable-next-line
    : require('-!babel-loader!svg-react-loader!../../assets/MSFTLogo.svg');

const Shell = ({ siteInspectorInitialized, currentPath, customerCssPath,
    position, tabs, visible, onToggleShell,
    setCurrentPath, setShellPanelPosition, resetRouteUpdate,
    routesUpdated, messages, removeMessage }) => {
    const attachCustomToggle = () => {
        const elem = document.getElementById(config.toggleElementId);
        if (elem && elem.className.indexOf('si-attached') === -1) {
            elem.addEventListener('click', onToggleShell, false);
            // prevent multiple events from attaching
            elem.className += ' si-attached';
        }
        return elem !== null;
    };

  const getMenuItems = () => {
    const items = [
      {
        onClick: () => { setShellPanelPosition(position === 'right' ? 'left' : 'right'); },
        text: `Position ${position === 'right' ? 'Left' : 'Right'}`,
      }];
    items.push({
      onClick: () => { window.open(config.aboutUrl); },
      text: 'About',
    });
    return { items };
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
                <div className="header-title">{config.title}</div>
              </div>
              <div className="si-header-right">
                <ActionMenu
                  actionTrigger={{ glyph: 'settings' }}
                  menu={getMenuItems()}
                />
                <div title="Close StoreInspector" className="panel-glyph">
                  <span className="c-glyph glyph-cancel" aria-hidden="true" onClick={onToggleShell} />
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
                      messages={messages}
                      removeMessage={removeMessage}
                  />
            </div>
          </div>
        </div>
            : null);
};

Shell.propTypes = {
  currentPath: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    isCollapsing: PropTypes.bool,
    key: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.number,
    timeout: PropTypes.number,
  })),
  removeMessage: PropTypes.func.isRequired,
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

Shell.defaultProps = {
  messages: [],
};

export default Shell;
