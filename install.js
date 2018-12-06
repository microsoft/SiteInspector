// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { execSync } = require('child_process');
const { readdirSync, statSync, unlinkSync } = require('fs');
const { join } = require('path');

const tabsRoot = 'src/Tabs/';
const siteInspectorClientDirectory = 'src/SiteInspector';

const installDirectories = readdirSync(tabsRoot)
  .filter(folder =>
    folder !== 'dist' &&
    statSync(join(tabsRoot, folder)).isDirectory())
  .map(folder => tabsRoot + folder)

installDirectories.push(siteInspectorClientDirectory);

installDirectories.forEach((directory) => {
  const existingFiles = readdirSync(directory)
    .filter(file => !statSync(join(directory, file)).isDirectory());

  const npmInstallCommand = `npm --prefix ${directory} install ${directory}`;

  console.log(`Running ${npmInstallCommand}`);

  try {
    execSync(npmInstallCommand,
      (error, stdout) => {
        if (stdout) {
          console.log(stdout);
        }

        if (error === null) {
          console.log(`Install succeeded for ${directory}`);
        } else {
          console.log(console.log(error));
        }
      });
  } catch (ex) {
    console.log(ex);
  }

  console.log('Removing npm --prefix files');

  readdirSync(directory)
    .filter(file =>
      !statSync(join(directory, file)).isDirectory() && !existingFiles.includes(file))
    .forEach(file => unlinkSync(join(directory, file)));
});
