// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import PropTypes from 'prop-types';
import { Label, TextField } from '../../shared/components/FluentWeb';

const ContactViewer = ({ title, email }) => (
  <div className="contact-container">
    <Label text="Site" />
    <TextField type="text" id="team-input" value={title} readOnly />
    <Label text="Site Support Email" />
    <TextField type="text" id="email-input" value={email} readOnly />
  </div>
);

ContactViewer.propTypes = {
  email: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ContactViewer;
