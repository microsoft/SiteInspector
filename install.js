// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { sync } = require('rimraf');
const { execSync } = require('child_process');
const {
  readdirSync,
  statSync,
  renameSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} = require('fs');
const { join } = require('path');

const binDirectoryLocation = 'node_modules/.bin';
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

  console.log('Moving dependency executables to bin');
  
  const binDirectory = join(directory, binDirectoryLocation);

  if (!existsSync(binDirectory)){
    mkdirSync(binDirectory);
  }

  readdirSync(directory)
    .filter(file =>
      !statSync(join(directory, file)).isDirectory() && !existingFiles.includes(file))
    .forEach((file) => {
      const source = join(directory, file);
      const target = join(binDirectory, file);

      if (existsSync(target)){
        sync(target);
      }

      const content = readFileSync(source);
      const toWrite = content.toString()
        .replace(/node_modules\\/g, '..\\')
        .replace(/node_modules\//g, '../');

      writeFileSync(source, toWrite);

      renameSync(source, target);
    });
});
