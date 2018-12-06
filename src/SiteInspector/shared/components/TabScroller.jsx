/* eslint jsx-a11y/aria-props:"off" */
import React from 'react';
import PropTypes from 'prop-types';

const TabScroller = ({ direction, isVisible, onScroll }) => (
  !isVisible ? null : <a
    className={`panel-tabs-scroller ${direction}-scroller si-glyph si-glyph-chevron-${direction}`}
    href="javascript:void(0)" onClick={() => onScroll(direction)}
  />);

TabScroller.propTypes = {
  direction: PropTypes.string.isRequired,
  onScroll: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

TabScroller.defaultProps = {
  isVisible: false,
};

export default TabScroller;
