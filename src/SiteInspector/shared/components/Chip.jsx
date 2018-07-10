import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Chip = ({ extraClassNames, glyph, title, href, target }) => (
  <div className={classNames('si-chip', extraClassNames)}>
    <a className="urlpad" href={href} target={target} aria-label={title}>
      {title}
    </a>
    <a href={href} target={target} aria-label="Redirect">
      <span className={glyph} />
    </a>
  </div>
);

Chip.propTypes = {
  extraClassNames: PropTypes.string,
  glyph: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
};

Chip.defaultProps = {
  extraClassNames: '',
};

export default Chip;
