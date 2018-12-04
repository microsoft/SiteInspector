// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { connect } from 'react-redux';
import DynamicTabViewer from './component';

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

const DynamicTabContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DynamicTabViewer);

export default DynamicTabContainer;
