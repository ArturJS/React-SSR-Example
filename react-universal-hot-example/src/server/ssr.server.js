import React from 'react';
import {renderToString} from 'react-router-server';
import {StaticRouter} from 'react-router';
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

function _renderAndSendPage(req, res, pageComponent, data) {
  const context = {};

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

      res.send('<!doctype html>\n' + addPrebootInlineCode(html));
    })
    .catch(err => console.error(err));
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