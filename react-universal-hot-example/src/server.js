import Express from 'express';
import React from 'react';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';

import {renderToString} from 'react-router-server';
import {StaticRouter} from 'react-router';

import Html from './helpers/Html';
import Client from './client';
import http from 'http';
import {getInlineCode} from 'preboot';

const prebootOptions = {
  appRoot: 'body',
  freeze: false,
  focus: true,
  buffer: true,
  keyPress: true,
  buttonPress: true
};

const inlinePrebootCode = getInlineCode(prebootOptions);

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});


app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }

  const context = {};

  renderToString(
    <Html assets={webpackIsomorphicTools.assets()} component={
      __DISABLE_SSR__ ? null :
      <StaticRouter
        location={req.url}
        context={context}>
        {Client}
      </StaticRouter>
    }/>
  )
    .then(({html}) => { // todo add caching of generated html
      if (context.url) {
        _redirectTo(res, context.url);
        return;
      }

      res.send('<!doctype html>\n' + addPrebootInlineCode(html));
    })
    .catch(err => console.error(err));

});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}

// private methods


function _redirectTo(res, redirectUrl) {
  res.writeHead(302, {
    Location: redirectUrl
  });
  res.end();
}

function addPrebootInlineCode(html) {
  return html.replace('</head>', '<script>' + inlinePrebootCode + '</script></head>');
}
