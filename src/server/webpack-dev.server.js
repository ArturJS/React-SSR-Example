import webpack from 'webpack';
import webpackConfig from '../../webpack/dev.config';

const compiler = webpack(webpackConfig);
const serverOptions = {
  quiet: true,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
};

export const initWebpackDevServer = (app) => {
  app.use(require('webpack-dev-middleware')(compiler, serverOptions));
  app.use(require('webpack-hot-middleware')(compiler));
};
