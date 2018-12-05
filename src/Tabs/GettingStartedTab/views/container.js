// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { connect } from 'react-redux';
import CustomTabViewer from './component';

const mapStateToProps = (state) => ({
    // Access redux state here
    // To access shared state:
    //   propertyName: state.SharedState.propertyName
    // To access SiteInspector parent application state:
    //   propertyName: state.ShellState.propertyName
    // To access self state:
    //   propertyName: state[config.stateNamespace].propertyName
});

const mapDispatchToProps = (dispatch) => ({
    // Write dispatch actions here
});

const CustomTabContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomTabViewer);

export default CustomTabContainer;
