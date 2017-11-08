import Express from 'express';
import http from 'http';
import config from './config';

import {initStaticServer} from './server/static.server';
import {initSSRServer} from './server/ssr.server';
import {initWebpackDevServer} from './server/webpack-dev.server';

const app = new Express();
const server = new http.Server(app);

initStaticServer(app); // here better use nginx
initSSRServer(app);

if (__DEVELOPMENT__) {
  initWebpackDevServer(app);
}


if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info(`----\n==> ✅  ${config.app.title} is running, talking to API server on ${config.apiTargetUrl}.`);
    console.info(`==> 💻  Open ${config.uiTargetUrl} in a browser to view the app.`);
  });
}
else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
