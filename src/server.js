import Express from 'express';
import http from 'http';
import config from './config';

import {initStaticServer} from './server/static.server';
import {initProxyServer} from './server/proxy.server';
import {initSSRServer} from './server/ssr.server';

const app = new Express();
const server = new http.Server(app);

initStaticServer(app);
initProxyServer(app, server);
initSSRServer(app);


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
