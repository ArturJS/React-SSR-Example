/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import 'preboot';
import React from 'react';
import {Switch, Route} from 'react-router';
import {hydrate} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import rootRoutes from './routes';
import App from './client/components/App';
import './client/helpers/register-service-worker';

let dest;

const Client = (
  <App>
    {_renderRoutes(rootRoutes)}
  </App>
);

if (__CLIENT__) {
  dest = document.getElementById('content');
  hydrate(
    <BrowserRouter>
      {Client}
    </BrowserRouter>,
    dest
  );
}

export default Client;


if (process.env.NODE_ENV !== 'production') {
  global.React = React; // enable debugger
}

function _renderRoutes(routes) {
  return (
    routes
      ?
      <Switch>
        {routes.map((route, i) => {
          let childComponents = _renderRoutes(route.routes);

          if (childComponents) {
            childComponents = (
              <route.component>
                {childComponents}
              </route.component>
            );
          }
          return (
            <Route
              key={route.key || i}
              path={route.path}
              exact={route.exact}
              strict={route.strict}
              component={childComponents ? null : route.component}>
              {childComponents}
            </Route>
          );
        })}
      </Switch>
      : null
  );
}