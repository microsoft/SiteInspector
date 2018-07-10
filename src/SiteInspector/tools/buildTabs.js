/* eslint-disable import/no-extraneous-dependencies */

import chalk from 'chalk';

const { exec } = require('child_process');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const tabsRoot = '../Tabs/';

const buildCommand = `build${process.argv.includes('--production') ? ':p' : ''}`;
const tabDirectories = readdirSync(tabsRoot)
  .filter(folder =>
    folder !== 'dist' &&
    statSync(join(tabsRoot, folder)).isDirectory())
  .map(folder => tabsRoot + folder);

tabDirectories.forEach((directory) => {
  const wepbackPath = `${directory}/webpack.config.js`;

  exec(`npm run-script ${buildCommand} --prefix ${directory}`,
    (error, stdout) => {
      if (stdout.toLowerCase().includes('error')) {
        console.log(chalk.red(stdout));
      } else {
        console.log(stdout);
      }

      if (error === null) {
        console.log(chalk.green(`Webpack succeeded for ${wepbackPath}`));
      }
    });
});
