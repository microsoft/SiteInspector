import React from 'react';
import PropTypes from 'prop-types';
import { ActionMenu } from '../../shared/components/FluentWeb';
import config from '../../shared/config';
import ShellInspectorRouter from '../../router/ShellInspectorRouter';
import authenticationStates from '../../shared/authenticationStates';
import Spinner from '../../shared/components/Spinner';
import AuthenticationLink from '../../shared/components/AuthenticationLink';
import UserAccount from '../../shared/components/UserAccount';
import Modal from '../../shared/components/Modal';

// eslint-disable-next-line
const Glass = require('-!babel-loader!svg-react-loader!../../assets/SITab.svg');

const Logo = config.logo
  ? config.logo
  // eslint-disable-next-line
    : require('-!babel-loader!svg-react-loader!../../assets/MSFTLogo.svg');

const disableText = `You are disabling SiteInspector from loading on this site for the reminder of this session.
  If you would like to renable SiteInspector manually, please use the following url:`;

const disableModalStyle = {
  content: {
    left: '70%',
    'max-height': '30%',
  },
};

const Shell = ({ siteInspectorInitialized, authenticationState, currentPath, customerCssPath,
    position, tabs, user, visible, fetchAuthToken, onToggleShell,
    setCurrentPath, setShellPanelPosition, signOut, resetRouteUpdate,
    routesUpdated, messages, removeMessage, siteInspectorEnabledFlightName,
    siteInspectorEnabledUrl, isVisibleDisableModal, disableSiteInspector, toggleDisableModal }) => {
  const getMenuItems = () => {
    const items = [
      {
        onClick: () => { setShellPanelPosition(position === 'right' ? 'left' : 'right'); },
        text: `Position ${position === 'right' ? 'Left' : 'Right'}`,
      }];
    if (window.siteInspector.onSubmitFlights && siteInspectorEnabledFlightName) {
      items.push({
        onClick: () => { toggleDisableModal(); },
        text: 'Disable...',
      });
    }
    items.push({
      onClick: () => { window.open(config.aboutUrl); },
      text: 'About',
    });
    return { items };
  };

  return (
        siteInspectorInitialized ? <div className="shell-panel">
          {customerCssPath &&
            <link rel="stylesheet" type="text/css" href={customerCssPath} />
            }
          <div className="shell-client-tab-container shadow">
            <a className="shell-client-tab" onClick={onToggleShell} href="javascript:void(0)">
              <Glass className="shell-icon-glass" />
              {typeof Logo === 'string'
                        ? <img className="shell-icon" src={Logo} alt="Product logo" />
                        : <Logo className="shell-icon" />
                    }
            </a>
          </div>
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
                <div className="si-user-account">
                  {user ?
                    <UserAccount
                      signOut={signOut}
                      user={user}
                    />
                                : null}
                </div>
              </div>
              <div className="si-header-right">
                <ActionMenu
                  actionTrigger={{ glyph: 'settings' }}
                  menu={getMenuItems()}
                />
                <Modal
                  visible={isVisibleDisableModal}
                  title="Disable SiteInspector"
                  closeHandler={() => toggleDisableModal()}
                  contentOverride={disableModalStyle}
                  displayUI={
                    <div>
                      <p>{disableText}</p>
                      <p>
                        <span>{siteInspectorEnabledUrl}</span>
                      </p>
                      <button className="c-button" aria-label="Cancel" onClick={() => toggleDisableModal()}>Cancel</button>
                      <button className="c-button o-primary" aria-label="Confirm" onClick={() => disableSiteInspector(siteInspectorEnabledFlightName)}>Confirm</button>
                    </div>}
                />
                <div title="Close StoreInspector" className="panel-glyph">
                  <span className="c-glyph glyph-cancel" aria-hidden="true" onClick={onToggleShell} />
                </div>
              </div>
            </div>
            <div className="panel-content-wrapper flex-column">
              {(() => {
                switch (authenticationState) {
                  case authenticationStates.REQUESTING:
                    return <Spinner label="Hold on, signing you in" />;
                  case authenticationStates.AUTHENTICATE:
                  case authenticationStates.SIGNED_OUT:
                    return (<div className="unauthenticated-view">
                      <AuthenticationLink fetchAction={fetchAuthToken}>
                                        Sign In </AuthenticationLink>
                      <span>
                        {config.authentication && config.authentication.message
                                            ? ` ${config.authentication.message}`
                                            : ' with corpnet'}
                      </span>
                    </div>);
                  case authenticationStates.TIMED_OUT:
                    return (
                      <div className="unauthenticated-view">
                        <span>Login request has timed out. Try </span>
                        <AuthenticationLink
                          fetchAction={fetchAuthToken}
                        >Signing in</AuthenticationLink>
                        <span> again</span>
                      </div>);
                  case authenticationStates.DENIED:
                    return (
                      <div className="unauthenticated-view">
                        <span>Access denied. Try </span>
                        <AuthenticationLink
                          fetchAction={fetchAuthToken}
                        >Signing in</AuthenticationLink>
                        <span> again</span>
                      </div>);
                  case authenticationStates.GRANTED:
                    return (
                      <ShellInspectorRouter
                        tabs={tabs}
                        initialPath={currentPath}
                        setPath={setCurrentPath}
                        routesUpdated={routesUpdated}
                        resetRouteUpdate={resetRouteUpdate}
                        messages={messages}
                        removeMessage={removeMessage}
                      />
                    );
                  default:
                    return null;
                }
              })()
                    }
            </div>
          </div>
        </div>
            : null);
};

Shell.propTypes = {
  authenticationState: PropTypes.string.isRequired,
  currentPath: PropTypes.string.isRequired,
  customerCssPath: PropTypes.string.isRequired,
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
  user: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  fetchAuthToken: PropTypes.func.isRequired,
  onToggleShell: PropTypes.func.isRequired,
  setCurrentPath: PropTypes.func.isRequired,
  setShellPanelPosition: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  siteInspectorInitialized: PropTypes.bool.isRequired,
  resetRouteUpdate: PropTypes.func.isRequired,
  routesUpdated: PropTypes.bool.isRequired,
  siteInspectorEnabledFlightName: PropTypes.string.isRequired,
  siteInspectorEnabledUrl: PropTypes.string.isRequired,
  isVisibleDisableModal: PropTypes.bool.isRequired,
  disableSiteInspector: PropTypes.func.isRequired,
  toggleDisableModal: PropTypes.func.isRequired,
};

Shell.defaultProps = {
  messages: [],
};

export default Shell;
