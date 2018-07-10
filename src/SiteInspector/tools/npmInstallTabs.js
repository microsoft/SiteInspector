/* eslint-disable import/no-extraneous-dependencies */

import chalk from 'chalk';

const { execSync } = require('child_process');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const tabsRoot = '../Tabs/';

const tabDirectories = readdirSync(tabsRoot)
  .filter(folder =>
    folder !== 'dist' &&
    statSync(join(tabsRoot, folder)).isDirectory())
  .map(folder => tabsRoot + folder);

tabDirectories.forEach((directory) => {
  const npmInstallCommand = `npm --prefix ${directory} install ${directory}`;

  console.log(`Running ${npmInstallCommand}`);

  try {
    execSync(npmInstallCommand,
      (error, stdout) => {
        if (stdout) {
          console.log(stdout);
        }

        if (error === null) {
          console.log(chalk.green(`Install succeeded for ${directory}`));
        } else {
          console.log(console.log(chalk.red(error)));
        }
      });
  } catch (ex) {
    console.log(ex);
  }
});
