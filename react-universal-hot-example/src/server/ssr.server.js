import React from 'react';
import {renderToString} from 'react-router-server';
import {StaticRouter} from 'react-router';
import {inspect} from 'import-inspector';
import Html from '../client/helpers/Html';
import App from '../client/components/App';
import {getInlineCode} from 'preboot';
import {matchRoutes} from 'react-router-config';
import routes from './../routes';

const prebootOptions = {
  appRoot: 'body',
  freeze: false,
  focus: true,
  buffer: true,
  keyPress: true,
  buttonPress: true
};

const inlinePrebootCode = getInlineCode(prebootOptions);

// todo fix (it's incorrect in development mode)
const webpackStats = require('../../static/dist/output-webpack-stats.json');

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

function _renderAndSendPage(req, res, pageComponent, data) {
  const context = {};

  let lazyImports = [];
  // setup a watcher
  // necessary for react-loadable components
  let stopInspecting = inspect(metadata => {
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
    .then(({html}) => { // todo add caching of generated html
      if (context.url) {
        _redirectTo(res, context.url);
        return;
      }

      // necessary for react-loadable components
      stopInspecting();
      html = _addLazyModules(html, req.url, lazyImports);

      res.send('<!doctype html>\n' + addPrebootInlineCode(html));
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

  const mainAssetPath = _getMainPathForModules();
  console.log('mainAssetPath', mainAssetPath);
  console.log('imported', lazyImports);

  const lazyScripts = lazyImports.map(lazyImport => {
    const moduleName = _getChunkNameByPath(lazyImport.serverSideRequirePath);
    const fileName = webpackStats.assetsByChunkName[moduleName];

    console.log('moduleName', moduleName);
    console.log('fileName', fileName);

    return `<script src="${mainAssetPath + fileName}" charset="UTF-8"><script/>`;
  });

  return html.replace('</body>', lazyScripts + '</body>');
}

function _getChunkNameByPath(serverSideRequirePath) {
  return serverSideRequirePath.substr(serverSideRequirePath.lastIndexOf('\\') + 1);
}

function _getMainPathForModules() {
  const mainPath = webpackIsomorphicTools.assets().javascript.main;
  return mainPath.substr(0, mainPath.lastIndexOf('/') + 1);
}

function _redirectTo(res, redirectUrl) {
  res.writeHead(302, {
    Location: redirectUrl
  });
  res.end();
}

function addPrebootInlineCode(html) {
  return html.replace('</head>', '<script>' + inlinePrebootCode + '</script></head>');
}