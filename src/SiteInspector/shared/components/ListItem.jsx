import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ListItem = ({ content, active }) => {
  const listItemClasses = () => classNames({
    active,
    'si-list-item': true,
  });

  return (
    <div className={listItemClasses()}>
      {content}
    </div>
  );
};

ListItem.propTypes = {
  content: PropTypes.shape().isRequired,
  active: PropTypes.bool,
};

ListItem.defaultProps = {
  active: false,
};

export default ListItem;
