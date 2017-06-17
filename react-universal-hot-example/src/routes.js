import React from 'react';
import {Redirect} from 'react-router';
import {
  HomePage,
  AboutPage,
  NotFoundPage
} from './client/components/pages';

const routes = [
  {
    path: '/',
    exact: true,
    component: HomePage
  },
  {
    path: '/about',
    exact: true,
    component: AboutPage
  },
  {
    path: '/404',
    exact: true,
    component: NotFoundPage
  },
  {
    path: '/*',
    redirectTo: '/404', // explicit flag for ssr processing on server.js
    component: () => <Redirect to="/404"/>
  }
];

export default routes;
