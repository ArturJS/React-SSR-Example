import React from 'react';
import {renderToString} from 'react-router-server';
import {StaticRouter} from 'react-router';
import {inspect} from 'import-inspector';
import Html from '../client/helpers/Html';
import App from '../client/components/App';
import {matchRoutes} from 'react-router-config';
import routes from './../routes';
import {JSDOM} from 'jsdom';
import _ from 'lodash';

export const initSSRServer = (app) => {
  app.use(async(req, res) => {
    const branch = matchRoutes(routes, req.url);
    const lastMatchedRoute = _.last(branch);

    if (__SERVER__ && lastMatchedRoute.redirectTo) {
      _redirectTo(res, lastMatchedRoute.redirectTo);
      return false;
    }

    const {fetchData} = branch[0].route.component;
    let serverData;

    if (fetchData) {
      try {
        serverData = await fetchData();
      }
      catch (err) {
        console.error(err);
      }
    }

    const pageComponent = getPageComponentFromMatchedRoutes(branch, serverData);

    if (__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      webpackIsomorphicTools.refresh();
    }

    res.send(
      await renderPage(req.url, pageComponent, serverData)
    );
  });
};

// todo: use https://github.com/audreyt/node-webworker-threads
export async function renderPage(url, pageComponent, serverData) {
  const context = {};
  let lazyImports = [];

  _resetGlobalChartsRenderQueue();

  // setup a watcher
  let stopInspecting = inspect(metadata => { // necessary for react-loadable components
    lazyImports.push(metadata);
  });

  try {
    let {html} = await renderToString(
      <Html
        assets={webpackIsomorphicTools.assets()}
        initialPageProps={serverData}
        component={
          __DISABLE_SSR__ ? null :
            <StaticRouter context={context} location={url}>
              <App>
                {pageComponent}
              </App>
            </StaticRouter>
        }
      />
    );

    stopInspecting(); // necessary for react-loadable components
    html = _addLazyModules(html, url, lazyImports);
    html = await _renderCharts(html);

    return `<!doctype html>${html}`;
  }
  catch (err) {
    console.error(err);
  }
}

export function getPageComponentFromMatchedRoutes(branch, serverData) {
  return _.reduceRight(branch, (componentPyramid, {route}) => (
    React.createElement(route.component, {children: componentPyramid, serverData})
  ), null); // collect components from the inside out of matched routes;
}


// private methods

const lazyModulesCache = {};

function _resetGlobalChartsRenderQueue() {
  global.chartsRenderQueue = {
    barChartQueue: []
  };
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
    return `<script src="${lazyChunkPath}" charset="UTF-8"></script>`;
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
