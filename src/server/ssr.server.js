import React from 'react';
import {StaticRouter} from 'react-router';
import Loadable from 'react-loadable';
import ReactDOMServer from 'react-dom/server';
import {matchRoutes} from 'react-router-config';
import _ from 'lodash';
import {Transform} from 'stream';

import Html from '../client/helpers/Html';
import App from '../client/components/App';
import routes from './../routes';

export const initSSRServer = async(app) => {
  await Loadable.preloadAll(); // necessary to resolve paths to lazy imports on server side

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

    renderToNodeStreamPage({req, res, pageComponent, serverData});
  });
};

function renderToNodeStreamPage({req, res, pageComponent, serverData}) {
  const context = {};
  const lazyModules = [];
  const {url} = req;

  const renderStream = ReactDOMServer.renderToNodeStream(
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

  res.write('<!doctype html>');

  const htmlChunksTransformStream = new HtmlChunksTransformStream({
    transformers: [
      (htmlChunk) => {
        if (htmlChunk.indexOf('</body>') > -1) {
          console.log('before htmlChunk ', htmlChunk);
          console.log('lazyModules', lazyModules);
          htmlChunk = _addLazyModules(htmlChunk, lazyModules);
          console.log('after htmlChunk ', htmlChunk);
        }
        return htmlChunk;
      }
    ]
  });

  renderStream
    .pipe(htmlChunksTransformStream)
    .pipe(res, {end: false});

  renderStream.on('end', () => {
    res.end();
  });
}


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

  return html.replace('</body>', lazyScripts + '</body>');
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

class HtmlChunksTransformStream extends Transform {
  constructor({transformers}) {
    super();
    this.transformers = transformers;
  }

  _transform(chunk, encoding, callback) {
    const htmlChunk = chunk.toString('utf8');

    const transformedHtmlChunk = this.transformers.reduce(
      (htmlBuffer, transformer) => transformer(htmlBuffer),
      htmlChunk
    );

    if (transformedHtmlChunk !== htmlChunk) {
      chunk = Buffer.from(transformedHtmlChunk, 'utf8');
    }

    this.push(chunk);
    callback();
  };
}
