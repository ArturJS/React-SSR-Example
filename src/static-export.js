import shell from 'shelljs';
import path from 'path';
import chalk from 'chalk';
import routes from '../src/routes';
import {_renderPage} from '../src/server/ssr.server';

const SOURCE_FOLDER = 'static';
const TARGET_FOLDER = 'static-build';

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
  let exactRoutes = routes.filter(route => route.exact);
  shell.cd(path.resolve(__dirname, `../${TARGET_FOLDER}`));

  for (let route of exactRoutes) {
    let [, fileName] = /\/([^/]*)$/.exec(route.path) || [, ''];
    let [, filePath] = /^\/?(.*\/)/.exec(route.path) || [, ''];
    if (fileName === '') {
      fileName = 'index';
    }
    fileName += '.html';

    if (filePath !== '/') {
      shell.mkdir('-p', filePath);
      shell.cd(path.resolve(__dirname, filePath));
    }

    const html = await _renderPage(route.path, route.component);
    shell.touch(fileName);
    shell.echo(html).to(fileName);
    if (filePath !== '/') {
      shell.cd(filePath.replace(/([^/]+)/g, '..'));
    }
  }
}
