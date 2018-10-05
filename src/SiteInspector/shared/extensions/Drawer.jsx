import PropTypes from 'prop-types';

class Drawer {
  constructor(props) {
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
