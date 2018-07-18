// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import uuidV4 from 'uuid/v4';
import store from '../store/configureStore';
import { addHttpInterceptItem } from '../shared/actions';

export default () => {
  let xhrCounter = 0;
  (function (send) {
    XMLHttpRequest.prototype.send = function (data) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
          try {
            if (this.httpInfo) {
              this.httpInfo.response.status = this.status;
              this.httpInfo.request.data = data;

              if (this.responseType === '' || this.responseType === 'text') {
                this.httpInfo.response.body = this.responseText;
              }

              const headers = this.getAllResponseHeaders().split('\r\n');
              const self = this;

              headers.forEach((header) => {
                const index = header.indexOf(': ');
                if (index !== -1) {
                  self.httpInfo.response.headers[(header.substr(0, index)).toUpperCase()] =
                        header.substr(index + 2);
                }
              });

              const requestMsCv = this.httpInfo.request.headers['MS-CV'];
              const responseMsCv = this.httpInfo.response.headers['MS-CV'];

              if (requestMsCv || responseMsCv) {
                store.dispatch(addHttpInterceptItem(this.httpInfo));
              }
            }
          } catch (e) { console.log(e); }
        }
      }, false);

      send.call(this, data);
    };
  }(XMLHttpRequest.prototype.send));


  (function (open) {
    XMLHttpRequest.prototype.open = function (verb, url) {
      this.httpInfo = {
        id: uuidV4(),
        xhrOrder: xhrCounter,
        request: {
          verb,
          url,
          headers: {},
        },
        response: {
          headers: {},
        },
      };
      xhrCounter += 1;

      open.call(this, verb, url);
    };
  }(XMLHttpRequest.prototype.open));

  ((setRequestHeader) => {
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      this.httpInfo.request.headers[header.toUpperCase()] = value;
      setRequestHeader.call(this, header, value);
    };
  })(XMLHttpRequest.prototype.setRequestHeader);
};
