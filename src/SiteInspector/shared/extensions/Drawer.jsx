import PropTypes from 'prop-types';
import { components as FluentDesign } from '@ms-fw/fw-react';

class Drawer extends FluentDesign.Drawer {
  constructor(props) {
    super(props);

    const handleTriggerClick = this.handleTriggerClick;
    this.handleTriggerClick = function (e) {
      props.onToggle();
      handleTriggerClick(e);
    };
  }
}

Drawer.propTypes = {
  onToggle: PropTypes.func,
  expanded: PropTypes.bool,
};

Drawer.defaultProps = {
  onToggle() {},
  expanded: true,
};

export default Drawer;
