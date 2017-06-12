/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import 'preboot';
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import routes from './routes';
import {App} from './components';

let dest;

if (__CLIENT__) {
  dest = global.document.getElementById('content');
}

const Client = (
  <App>
    {renderRoutes(routes)}
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
