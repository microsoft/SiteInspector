// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const babel = require('babel-core');

module.exports = {
  process: (src, filename) => {
    if (filename.indexOf('node_modules') === -1 &&
      babel.util.canCompile(filename)) {
      return babel.transform(src, { filename }).code;
    }

    return '';
  },
};
