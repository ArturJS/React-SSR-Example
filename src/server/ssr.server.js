import React from 'react';
import {renderToString} from 'react-router-server';
import {StaticRouter} from 'react-router';
import {inspect} from 'import-inspector';
import Html from '../client/helpers/Html';
import App from '../client/components/App';
import {getInlineCode} from 'preboot';
import {matchRoutes} from 'react-router-config';
import routes from './../routes';
import {JSDOM} from 'jsdom';

const prebootOptions = {
  appRoot: 'body',
  freeze: false,
  focus: true,
  buffer: true,
  keyPress: true,
  buttonPress: true
};

const inlinePrebootCode = getInlineCode(prebootOptions);

export const initSSRServer = (app) => {
  app.use((req, res) => {
    const branch = matchRoutes(routes, req.url);

    if (branch[0].redirectTo) {
      _redirectTo(res, branch[0].redirectTo);
      return;
    }

    const pageComponent = branch[0].route.component;

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }

    _resetGlobalChartsRenderQueue();

    if (pageComponent && pageComponent.fetchData) {
      pageComponent.fetchData()
        .then((data) => {
          _renderAndSendPage(req, res, pageComponent, data);
        });
    }
    else {
      _renderAndSendPage(req, res, pageComponent);
    }
  });
};


// private methods

const lazyModulesCache = {};

function _resetGlobalChartsRenderQueue() {
  global.chartsRenderQueue = {
    barChartQueue: []
  };
}

// todo: use https://github.com/audreyt/node-webworker-threads
function _renderAndSendPage(req, res, pageComponent, data) {
  const context = {};

  let lazyImports = [];

  // setup a watcher
  let stopInspecting = inspect(metadata => { // necessary for react-loadable components
    lazyImports.push(metadata);
  });

  renderToString(
    <Html
      assets={webpackIsomorphicTools.assets()}
      initialPageProps={data}
      component={
        __DISABLE_SSR__ ? null :
          <StaticRouter context={context} location={req.url}>
            <App>
              {
                React.createElement(pageComponent, {serverData: data})
              }
            </App>
          </StaticRouter>
      }
    />
  )
    .then(({html}) => {
      if (context.url) {
        _redirectTo(res, context.url);
        return;
      }

      stopInspecting(); // necessary for react-loadable components
      html = _addLazyModules(html, req.url, lazyImports);
      html = _addPrebootInlineCode(html);

      _renderCharts(html) // todo: use NodeJS 8 with async await
        .then((html) => {
          res.send('<!doctype html>\n' + html);
        });
    })
    .catch(err => console.error(err));
}

function _addLazyModules(html, requestUrl, lazyImports) {
  if (
    lazyImports.length === 0 && !lazyModulesCache[requestUrl] // necessary due to "lazyImports" generates only on first invocation ("renderToString" uses cache internally)
  ) return html;

  if (lazyImports.length > 0) {
    lazyModulesCache[requestUrl] = lazyImports;
  }

  lazyImports = lazyModulesCache[requestUrl];

  const lazyScripts = lazyImports.map(lazyImport => {
    const lazyChunkPath = _getChunkPath(lazyImport.serverSideRequirePath);
    return `<script src="${lazyChunkPath}" charset="UTF-8" async><script/>`;
  });

  return html.replace('</head>', lazyScripts + '</head>');
}

function _getChunkPath(serverSideRequirePath) {
  const moduleName = serverSideRequirePath.substr(serverSideRequirePath.lastIndexOf('\\') + 1);
  return webpackIsomorphicTools.assets().javascript[moduleName];
}

function _redirectTo(res, redirectUrl) {
  res.writeHead(302, {
    Location: redirectUrl
  });
  res.end();
}

function _addPrebootInlineCode(html) {
  return html.replace('</head>', '<script>' + inlinePrebootCode + '</script></head>');
}

function _renderCharts(html) {
  return new Promise((res, rej) => {
    const {barChartQueue} = global.chartsRenderQueue;
    if (barChartQueue.length === 0) {
      res(html);
      return;
    }

    let {window} = new JSDOM(html);
    global.d3 = window.d3;
    global.document = window.document;
    barChartQueue.forEach((renderChartFn) => renderChartFn());

    res(window.document.documentElement.outerHTML);
  });
}