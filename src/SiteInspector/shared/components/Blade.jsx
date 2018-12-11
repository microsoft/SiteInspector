import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Blade = ({ visible, title, closeHandler, displayUI, isLargerWidth }) => {
  const BladeClassNames = () => classNames({
    visible,
    'larger-width': isLargerWidth,
  });

  return (
    <div className={`si-blade flex-column ${BladeClassNames()}`}>
      <div className="si-blade-header">
        <div className="si-blade-header-title">{title}</div>
        <a href="javascript:void(0)" className="si-close-panel-icon fas fa-cog" onClick={closeHandler} />
      </div>
      <div className="si-blade-content flex-column">
        {visible && displayUI}
      </div>
    </div>
  );
};

Blade.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  displayUI: PropTypes.element.isRequired,
  isLargerWidth: PropTypes.bool,
};

Blade.defaultProps = {
  isLargerWidth: false,
};

export default Blade;
