const path = require('path');

const PATHS = {
  appSrc: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'public')
};

module.exports = {
  context: PATHS.appSrc,
  entry: './client.js',
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.json']
  }
};
