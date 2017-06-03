/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Redirect, Route, Switch} from 'react-router';

import {
  App,
  Home,
  About,
  NotFound
} from './containers';

const dest = document.getElementById('content');

if (__CLIENT__) {
  render(
    <BrowserRouter>
      <App>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="/404" component={NotFound}/>
          <Redirect from="/*" to="/404"/>
        </Switch>
      </App>
    </BrowserRouter>,
    dest
  );
} else {
  render(
    <App>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/404" component={NotFound}/>
        <Redirect from="/*" to="/404"/>
      </Switch>
    </App>,
    dest
  );
}


if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (
    !dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']
  ) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}


