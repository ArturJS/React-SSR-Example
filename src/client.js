/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import 'preboot';
import React from 'react';
import {Switch, Route} from 'react-router';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import rootRoutes from './routes';
import App from './client/components/App';

let dest;

if (__CLIENT__) {
  dest = global.document.getElementById('content');
}

const Client = (
  <App>
    {_renderRoutes(rootRoutes)}
  </App>
);

if (__CLIENT__) {
  render(
    <BrowserRouter>
      {Client}
    </BrowserRouter>,
    dest
  );
}

export default Client;


if (process.env.NODE_ENV !== 'production') {
  global.React = React; // enable debugger

  if (
    !dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']
  ) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
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