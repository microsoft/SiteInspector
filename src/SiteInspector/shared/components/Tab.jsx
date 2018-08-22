/* eslint jsx-a11y/aria-props:"off" */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SITab = ({ isActive, tab, setViewer }) => (
  <a
    className={`si-tab c-select-button ${classNames({ active: isActive })}`}
    aria-current={isActive}
    href="javascript:void(0)" onClick={() => setViewer(tab.id)}
  >{tab.label}</a>);

SITab.propTypes = {
  isActive: PropTypes.bool.isRequired,
  tab: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
  }).isRequired,
  setViewer: PropTypes.func.isRequired,
};

export default SITab;
