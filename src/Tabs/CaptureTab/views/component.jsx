// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { Spinner } from 'site-inspector-ui';
import { saveAs } from '../utils/FileSaver';
import config from '../shared/config';

require('../stylesheets/main.scss');

class CaptureViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  captureClick = () => {
    this.props.captureScreenshot(null);
    this.setState({
      isLoading: true,
    });
    html2canvas(document.body, {
      logging: false,
      useCORS: true,
      imageTimeout: 5000,
      onclone: (cloneDoc) => {
        const si = cloneDoc.getElementById(config.siteInspectorElement);
        // hard coded width to prevent overrendering
        cloneDoc.body.style.width = `${document.body.scrollWidth}px`;
        if (si) {
          si.parentElement.removeChild(si);
        }

        const style = cloneDoc.createElement('style');
        style.innerHTML = '* { animation-name: unset !important; -webkit-animation-duration: 0s !important; ' +
          'animation-duration: 0s !important; -webkit-animation-fill-mode: none !important; animation-fill-mode: none !important; ' +
          '-webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important; }';
        cloneDoc.body.appendChild(style);

        cloneDoc.body.scrollTop = 0;

        const sleep = (miliseconds) => {
          const currentTime = new Date().getTime();
          // eslint-disable-next-line no-empty
          while (currentTime + miliseconds >= new Date().getTime()) {
          }
        };

        sleep(config.captureDelay);

        return cloneDoc;
      },
    }).then((canvas) => {
      canvas.toBlob((blob) => {
        this.setState({
          isLoading: false,
        });
        this.props.captureScreenshot(blob);
      });
    }, () => {
      this.props.captureFail();
      this.setState({
        isLoading: false,
      });
    }).catch(() => {
      // TODO: Log error
    });
  }

  saveImage = () => {
    if (this.props.preview) {
      saveAs(this.props.preview, 'capture.png');
    }
  }

  render() {
    let imageUrl = null;
    if (this.props.preview) {
      imageUrl = URL.createObjectURL(this.props.preview);
    }
    return (
      <div className="flex-display-column capture-tab">
        <div className="si-capture-control-buttons">
          <button onClick={() => this.captureClick()}>Capture Screenshot</button>
          {this.props.preview &&
            <button onClick={() => this.saveImage()}>Save Screenshot</button>}
        </div>
        {this.state.isLoading && <Spinner label="Setting up screenshot" />}
        {this.props.preview && imageUrl && <div className="preview-container">
          <img src={imageUrl} className="capture-preview" alt="Screenshot Preview" />
        </div>}
      </div>
    );
  }
}

CaptureViewer.defaultProps = {
  captureScreenshot: null,
  preview: null,
  captureFail: null,
};

CaptureViewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  captureScreenshot: PropTypes.func,
  captureFail: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  preview: PropTypes.object,
};

export default CaptureViewer;
