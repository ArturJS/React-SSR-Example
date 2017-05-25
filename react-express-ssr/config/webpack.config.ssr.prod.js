process.env.NODE_ENV = 'development';

var path = require('path');
var StatsPlugin = require('stats-webpack-plugin');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var paths = require('./paths');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');

var envtype = '';
if (process.argv.indexOf('--qa') > -1) {
	envtype = 'qa';
}
else if (process.argv.indexOf('--java') > -1) {
	envtype = 'java';
}
else if (process.argv.indexOf('--dev') > -1) {
	envtype = 'dev';
}
else if (process.argv.indexOf('--local') > -1) {
	envtype = 'local';
}

var isCapthcaEnable = true;
if (process.argv.indexOf('--at') > -1) {
	isCapthcaEnable = false;
}

const nodeModules = {};
fs.readdirSync(path.join(__dirname, '../node_modules'))
	.filter(x => ['.bin'].indexOf(x) === -1)
	.forEach(mod => nodeModules[mod] = `commonjs ${mod}`);

const extractTextPlugin = new ExtractTextPlugin('[name].[hash:8].css');
extractTextPlugin.options.allChunks = true;
const config = server => {
	return ({
		entry: {
			app: path.join(__dirname, '../src', (server ? 'app.js' : 'client.js'))
		},

		output: {
			path: server ? path.join(__dirname, '../build', 'server') : path.join(__dirname, '../build', 'public'),
			filename: '[name].js',
			chunkFilename: '[id].[hash].js',
			publicPath: '/',
			libraryTarget: (server ? 'commonjs2' : 'var')
		},

		externals: (server ? nodeModules : {}),

		devtool: 'source-map',
		resolve: {
			extensions: ['.js', '.jsx']
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: paths.appNodeModulesRegex,
					loader: 'babel-loader'
				},
				{
					test: /\.scss$/,
					use: extractTextPlugin.extract({
						fallback: 'isomorphic-style-loader',
						use: 'css-loader?importLoaders=1!postcss-loader!sass-loader',
					})
				},
				{
					test: /\.css$/,
					loader: 'isomorphic-style-loader!css-loader'
				},
				{
					test: /\.(gif|png|jpg)$/,
					loader: 'file-loader'
				},
				{
					test: /\.woff2?(\?\S*)?$/,
					// Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
					// loader: "url?limit=10000"
					use: 'url-loader'
				},
				{
					test: /\.(ttf|eot|svg|otf)(\?[\s\S]+)?$/,
					use: 'file-loader'
				}
			]
		},

		plugins: [
			new FaviconsWebpackPlugin(paths.icon),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production'),
					type: JSON.stringify(envtype),
					isCapthcaEnable: JSON.stringify(isCapthcaEnable)
				}
			}),
			new StatsPlugin('stats.json', {
				chunkModules: true,
				exclude: [paths.appNodeModulesRegex]
			}),
			new UglifyJsPlugin({
				compress: {
					screw_ie8: true, // React doesn't support IE8
					warnings: false
				},
				mangle: {
					screw_ie8: true
				},
				output: {
					comments: false,
					screw_ie8: true
				}
			}),
			new webpack.LoaderOptionsPlugin({
				// test: /\.xxx$/, // may apply this only for some modules
				options: {
					// We use PostCSS for autoprefixing only.
					postcss: [
						autoprefixer({
							browsers: [
								'>1%',
								'last 4 versions',
								'Firefox ESR',
								'not ie < 9', // React doesn't support IE8 anyway
							]
						}),
					]
				}
			}),
			new HtmlWebpackPlugin({
				inject: true,
				xhtml: true,
				title: 'NI Onboarding',
				template: 'main.ejs',
				filename: 'index.ejs',
				minify: false,
				hash: true
			}),
			new CopyWebpackPlugin([
				{from: 'public', to: ''},
				{from: paths.themes, to: 'themes'}
			]),
			extractTextPlugin
		]
	});
};

module.exports = [Object.assign(config(true), {target: 'node'}), config(false)];
