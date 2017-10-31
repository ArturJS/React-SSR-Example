require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}


module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    main: [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      './src/client.js'
    ],
    prebootInit: './src/client/prebootInit.js'
  },
  output: {
    path: assetsPath,
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    rules: [
      {
        test: /preboot.*\.js$/, // necessary for fixing preboot library
        loader: 'string-replace-loader',
        query: {
          search: 'var preboot = prebootClient();',
          replace: 'window.preboot = prebootClient();'
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules|prebootInit/,
        use: [
          {
            loader: 'react-hot-loader/webpack'
          },
          {
            loader: 'babel-loader',
            options: babelrcObject
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {test: /\.json$/, loader: 'json-loader'},
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss-loader?parser=postcss-scss&sourceMap=true!sass-loader?outputStyle=expanded&sourceMap'
      },
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"},
      {test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240'}
    ]
  },
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __PRODUCTION__: false
    }),
    webpackIsomorphicToolsPlugin.development(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context &&
          module.context.indexOf('node_modules') !== -1;
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'prebootInit',
    //   filename: '[name].js'
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'preboot',
      minChunks: function (module) {
        return module.context && /preboot(?!(Init))/.test(module.context); // add 'preboot' and NOT 'prebootInit'
      }
    }),
    //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
    })
  ]
};
