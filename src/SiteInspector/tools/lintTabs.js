/* eslint-disable import/no-extraneous-dependencies */

import chalk from 'chalk';

const { exec } = require('child_process');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const tabsRoot = '../Tabs/';

const tabDirectories = readdirSync(tabsRoot)
  .filter(folder =>
    folder !== 'dist' &&
    statSync(join(tabsRoot, folder)).isDirectory())
  .map(folder => tabsRoot + folder);

tabDirectories.forEach((directory) => {
  exec(`npm run-script lint --prefix ${directory}`,
    (error, stdout) => {
      if (stdout.toLowerCase().includes('error')) {
        console.log(chalk.red(stdout));
      } else {
        console.log(stdout);
      }

      if (error === null) {
        console.log(chalk.green(`Lint succeeded for ${directory}`));
      }
    });
});
