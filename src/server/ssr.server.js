import React from 'react';
import {StaticRouter} from 'react-router';
import Loadable from 'react-loadable';
import ReactDOMServer from 'react-dom/server';
import {matchRoutes} from 'react-router-config';
import _ from 'lodash';
import {JSDOM} from 'jsdom';

import HtmlChunksTransformStream from './helpers/HtmlChunksTransformStream';
import Html from '../client/helpers/Html';
import App from '../client/components/App';
import routes from './../routes';


export const initSSRServer = async(app) => {
  await Loadable.preloadAll(); // necessary to resolve paths to lazy imports on server side

  app.use(async(req, res) => {
    const branch = matchRoutes(routes, req.url);
    const lastMatchedRoute = _.last(branch);

    if (lastMatchedRoute.redirectTo) {
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

    _renderToNodeStreamPage({req, res, pageComponent, serverData});
  });
};


export async function renderPage(url, pageComponent, serverData) {
  const {
    pageMarkup,
    lazyModules
  } = _getPageMarkupAndLazyModules({url, pageComponent, serverData});

  _resetChartsRenderQueue();

  try {
    let html = ReactDOMServer.renderToString(pageMarkup);
    html = _addLazyModules(html, lazyModules);
    html = _renderCharts(html);

    return `<!doctype html>${html}`;
  }
  catch (err) {
    console.error(err);
  }
}


export function getPageComponentFromMatchedRoutes(branch, serverData) {
  return _.reduceRight(branch, (componentPyramid, {route}) => (
    React.createElement(route.component, {children: componentPyramid, serverData})
  ), null); // collect components from the inside out of matched routes; (necessary for nested routes)
}


// private methods

function _renderToNodeStreamPage({req, res, pageComponent, serverData}) {
  const {url} = req;
  const {
    pageMarkup,
    lazyModules
  } = _getPageMarkupAndLazyModules({url, pageComponent, serverData});

  const renderStream = ReactDOMServer.renderToNodeStream(pageMarkup);

  _resetChartsRenderQueue();

  res.write('<!doctype html>');

  const htmlChunksTransformStream = new HtmlChunksTransformStream({
    transformers: [
      (htmlChunk) => {
        if (htmlChunk.indexOf('</body>') > -1) {
          htmlChunk = _addLazyModules(htmlChunk, lazyModules);
        }
        return htmlChunk;
      },

      _renderCharts
    ]
  });

  renderStream
    .pipe(htmlChunksTransformStream)
    .pipe(res, {end: false});

  renderStream.on('end', () => {
    setImmediate(() => { // it's necessary to avoid "Error: write after end" in case of huge number of htmlChunks
      res.end();
    });
  });
}

function _getPageMarkupAndLazyModules({url, pageComponent, serverData}) {
  const context = {};
  const lazyModules = [];

  const pageMarkup = (
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

  return {
    pageMarkup,
    lazyModules
  };
}

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

function _resetChartsRenderQueue() {
  global.chartsRenderQueue = {
    barChartQueue: {}
  };
}

function _renderCharts(html) {
  const {barChartQueue} = global.chartsRenderQueue;

  if (Object.keys(barChartQueue).length === 0) {
    return html;
  }

  for (const [id, renderChart] of Object.entries(barChartQueue)) {
    const chartTagRegexp = new RegExp(`<svg [^>]*id="${id}"[^>]*>[^<]*<\/svg>`);
    const [relatedChartTag] = chartTagRegexp.exec(html) || [''];
    const {window} = new JSDOM(relatedChartTag);

    renderChart(window);
    const renderedChart = window.document.body.innerHTML;

    html = html.replace(relatedChartTag, renderedChart);
  }

  _resetChartsRenderQueue();

  return html;
}

