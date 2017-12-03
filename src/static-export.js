import shell from 'shelljs';
import path from 'path';
import chalk from 'chalk';
import {matchRoutes} from 'react-router-config';
import sanitizeFilename from 'sanitize-filename';

import routes from '../src/routes';
import {
  renderPage,
  getPageComponentFromMatchedRoutes
} from '../src/server/ssr.server';

const SOURCE_FOLDER = 'static';
const TARGET_FOLDER = 'static-build';
const PATH_TO_TARGET_FOLDER = path.resolve(__dirname, `../${TARGET_FOLDER}`);

shell.rm('-rf', TARGET_FOLDER);
shell.cp('-Rf', SOURCE_FOLDER, TARGET_FOLDER);

renderRoutes()
  .then(() => {
    console.log(chalk.green('Static build compiled successfully!'));
    console.log(chalk.green(`See /${TARGET_FOLDER} folder.`));
  })
  .catch((err) => {
    console.log(chalk.red('ALARM! Something went wrong!'));
    console.log(chalk.red('See below for details:'));
    console.log(chalk.red(err));
    process.exit(1);
  });

async function renderRoutes() {
  let exactRoutes = _getFlattenListOfRoutes(routes).filter(route => route.exact);

  for (let route of exactRoutes) {
    const branch = matchRoutes(routes, route.path);
    const pageComponent = getPageComponentFromMatchedRoutes(branch);
    const html = await renderPage(route.path, pageComponent);
    _restoreShellExecutionPath();
    _createFoldersAndHtmlByUrl(route.path, html);
  }
}

// private methods

function _getFlattenListOfRoutes(routes) {
  _getFlattenListOfRoutesImpl._flattenListOfRoutes = [];
  _getFlattenListOfRoutesImpl(routes);

  const {_flattenListOfRoutes} = _getFlattenListOfRoutesImpl;
  _getFlattenListOfRoutesImpl._flattenListOfRoutes = [];
  return _flattenListOfRoutes;
}

function _getFlattenListOfRoutesImpl(routes) {
  for (let route of routes) {
    _getFlattenListOfRoutesImpl._flattenListOfRoutes.push(route);
    if (route.routes) {
      _getFlattenListOfRoutesImpl(route.routes);
    }
  }
}

function _restoreShellExecutionPath() {
  shell.cd(PATH_TO_TARGET_FOLDER);
}

function _createFoldersAndHtmlByUrl(url, html) {
  let [, fileName] = /\/([^/]*)$/.exec(url) || [, ''];
  let [, filePath] = /^\/?(.*\/)/.exec(url) || [, ''];
  if (fileName === '') {
    fileName = 'index';
  }
  fileName += '.html';
  fileName = sanitizeFilename(fileName);

  if (filePath !== '/') {
    filePath = path.resolve(PATH_TO_TARGET_FOLDER, filePath);
    shell.mkdir('-p', filePath);
    shell.cd(filePath);
  }
  shell.touch(fileName);
  shell.echo(html).to(fileName);
}
