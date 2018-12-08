// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';

class CustomTabViewer extends React.Component {
  componentDidMount() {
    // Service calls to set the data for the view
  }

  componentWillUpdate() {
    // Services calls required when any of the views attributes change
  }

  render() {
    return (
      <div id="customTab">
        <span>This is a custom tab.</span>
      </div>);
  }
}

// Proptypes

// Default prop types

export default CustomTabViewer;
