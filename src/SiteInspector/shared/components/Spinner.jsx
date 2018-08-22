import React from 'react';
import PropTypes from 'prop-types';
import { Spinner as FluentSpinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

function Spinner({ label }) {
  return (
    <div className="si-spinner">
      <FluentSpinner label={label} size={SpinnerSize.large} />
    </div>
  );
}

Spinner.propTypes = {
  label: PropTypes.string,
};

Spinner.defaultProps = {
  label: '',
};

export default Spinner;
