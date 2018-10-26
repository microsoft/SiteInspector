import React from 'react';
import PropTypes from 'prop-types';

const ActionMenu = ({ actionTrigger, menu }) => (
  <div className="si-action-menu">
    <button className="si-action-trigger" aria-expanded="false" aria-haspopup="true">
      {actionTrigger}
    </button>

    <ul className="si-context-menu" role="menu">
      {menu.map(menuItem => (
        <li key={menuItem.id} className="si-menu-item" onClick={menuItem.onClick}>
          {menuItem.content}
        </li>
      ))}
    </ul>
  </div>
);

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
