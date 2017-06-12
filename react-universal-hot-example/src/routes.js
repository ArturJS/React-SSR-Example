import React from 'react';
import {Redirect} from 'react-router';
import {
  Home,
  About,
  NotFound
} from './components';

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/about',
    exact: true,
    component: About
  },
  {
    path: '/404',
    exact: true,
    component: NotFound
  },
  {
    path: '/*',
    component: () => <Redirect to="/404"/>
  }
];

export default routes;
