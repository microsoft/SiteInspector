import React from 'react';
import PropTypes from 'prop-types';

class ActionMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggled: false,
    };

    this.onTrigger = this.onTrigger.bind(this);
  }

  onTrigger = () => {
    const isToggled = !this.state.toggled;

    if (isToggled) {
      const onExitClickEventHandler = () => {
        this.setState({ toggled: false });
        document.removeEventListener('click', onExitClickEventHandler);
      };

      document.addEventListener('click', onExitClickEventHandler);
    }

    // Only set state when toggled to true. Toggling off is handled by the above click handler
    if (isToggled) {
      this.setState({ toggled: isToggled });
    }
  }

  render() {
    return (
      <div className="si-action-menu">
        <button
          className="si-action-trigger"
          aria-expanded={this.state.toggled}
          aria-haspopup={!this.state.toggled}
          onClick={this.onTrigger}
        >
          {this.props.actionTrigger}
        </button>
        <ul className="si-context-menu" role="menu">
          {this.props.menu.map(menuItem => (
            <li key={menuItem.id} className="si-menu-item" onClick={menuItem.onClick}>
              {menuItem.content}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ActionMenu.propTypes = {
  actionTrigger: PropTypes.element.isRequired,
  menu: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    onClick: PropTypes.func,
  })),
};

ActionMenu.defaultProps = {
  menu: [],
};

export default ActionMenu;
