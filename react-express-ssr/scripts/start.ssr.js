var rimraf = require('rimraf');

console.log('removing old build...');
rimraf.sync('./build');
console.log('old build removed');

process.env.NODE_ENV = 'development';

var webpack = require('webpack');
var chalk = require('chalk');
var config = require('../config/webpack.config.ssr.dev.js');

if (process.argv.indexOf('-p') > -1) {
	config = require('../config/webpack.config.ssr.prod.js');
	process.env.NODE_ENV = 'production';
}

var clearConsole = require('react-dev-utils/clearConsole');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
var isInteractive = process.stdout.isTTY;
var pathExists = require('path-exists');
var paths = require('../config/paths');
var useYarn = pathExists.sync(paths.yarnLockFile);
var cli = useYarn ? 'yarn' : 'npm';

var handleCompile = function (err, stats) {
	if (err || stats.hasErrors() || stats.hasWarnings()) {
		process.exit(1);
	} else {
		process.exit(0);
	}
};

function startCompiler() {
// "Compiler" is a low-level interface to Webpack.
// It lets us listen to some events and provide our own custom messages.
	compiler = webpack(config, handleCompile);

// "invalid" event fires when you have changed a file, and Webpack is
// recompiling a bundle. WebpackDevServer takes care to pause serving the
// bundle, so if you refresh, it'll wait instead of serving the old one.
// "invalid" is short for "bundle invalidated", it doesn't imply any errors.
	compiler.plugin('invalid', function () {
		if (isInteractive) {
			clearConsole();
		}
		console.log('Compiling...');
	});

	compiler.plugin('done', function (stats) {
		if (isInteractive) {
			clearConsole();
		}

		// We have switched off the default Webpack output in WebpackDevServer
		// options so we are going to "massage" the warnings and errors and present
		// them in a readable focused way.
		var messages = formatWebpackMessages(stats.toJson({}, true));
		var isSuccessful = !messages.errors.length && !messages.warnings.length;
		var showInstructions = isSuccessful && (isInteractive || isFirstCompile);

		if (isSuccessful) {
			console.log(chalk.green('Compiled successfully!'));
		}

		if (showInstructions) {
			console.log();
			console.log('The app is running at:');
			console.log();

			console.log();
			console.log('Note that the development build is not optimized.');
			console.log('To create a production build, use ' + chalk.cyan(cli + ' run build:prod') + '.');
			console.log();
			isFirstCompile = false;
		}

		// If errors exist, only show errors.
		if (messages.errors.length) {
			console.log(chalk.red('Failed to compile.'));
			console.log();
			messages.errors.forEach(message => {
				console.log(message);
				console.log();
			});
			return;
		}

		// Show warnings if no errors were found.
		if (messages.warnings.length) {
			console.log(chalk.yellow('Compiled with warnings.'));
			console.log();
			messages.warnings.forEach(message => {
				console.log(message);
				console.log();
			});
			// Teach some ESLint tricks.
			console.log('You may use special comments to disable some warnings.');
			console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
			console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
		}
	});
}

startCompiler();
