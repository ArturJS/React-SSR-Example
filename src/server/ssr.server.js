import React from 'react';
import {StaticRouter} from 'react-router';
import Loadable from 'react-loadable';
import ReactDOMServer from 'react-dom/server';

import Html from '../client/helpers/Html';
import App from '../client/components/App';
import {matchRoutes} from 'react-router-config';
import routes from './../routes';
import _ from 'lodash';

export const initSSRServer = (app) => {
  app.use(async(req, res) => {
    const branch = matchRoutes(routes, req.url);
    const lastMatchedRoute = _.last(branch);

    if (__SERVER__ && lastMatchedRoute.redirectTo) { // do we need __SERVER__ ?
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


export async function renderPage(url, pageComponent, serverData) {
  const context = {};
  let lazyModules = [];

  try {
    let html = ReactDOMServer.renderToString(
      <Html
        assets={webpackIsomorphicTools.assets()}
        initialPageProps={serverData}
        component={
          __DISABLE_SSR__ ? null :
            <StaticRouter context={context} location={url}>
              <Loadable.Capture report={moduleName => lazyModules.push(moduleName)}>
                <App>
                  {pageComponent}
                </App>
              </Loadable.Capture>
            </StaticRouter>
        }
      />
    );

    html = _addLazyModules(html, lazyModules);

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

function _addLazyModules(html, lazyImports) {
  const lazyScripts = lazyImports.map(modulePath => {
    const lazyChunkPath = _getChunkPath(modulePath);
    return `<script src="${lazyChunkPath}" charset="UTF-8"></script>`;
  });

  return html.replace('</head>', lazyScripts + '</head>');
}

function _getChunkPath(modulePath) {
  const moduleName = modulePath.substr(modulePath.lastIndexOf('/') + 1);
  return webpackIsomorphicTools.assets().javascript[moduleName];
}

function _redirectTo(res, redirectUrl) {
  res.writeHead(302, {
    Location: redirectUrl
  });
  res.end();
}
