import React from 'react';
import {Redirect} from 'react-router';
import Loadable from 'react-loadable';
import {report} from 'import-inspector';
import path from 'path';

import HomePage from './client/components/pages/HomePage';
import NotFoundPage from './client/components/pages/NotFoundPage';

// const LoadableComponent = (componentPath) => { // Critical dependency: the request of a dependency is an expression
//   return Loadable({ // see also https://github.com/AngularClass/angular-starter/issues/993
//     loader: () => System.import(/* webpackMode: "lazy" */componentPath),
//     loading: <div>Loading...</div>,
//     serverSideRequirePath: path.resolve(__dirname, componentPath),
//     webpackRequireWeakId: () => require.resolveWeak(componentPath)
//   });
// };


// taken from https://github.com/webpack/webpack/issues/2461
if(typeof System === "undefined" || typeof System.import !== "function") {
  global.System = {
    import: function(path) {
      return Promise.resolve(require(path));
    }
  };
}

const routes = [
  {
    path: '/',
    exact: true,
    component: HomePage
  },
  {
    path: '/about',
    exact: true,
    // component: LoadableComponent('./client/components/pages/AboutPage/AboutPage')
    component: Loadable({
      loader: () => report(
        System.import(/* webpackChunkName: 'AboutPage' */'./client/components/pages/AboutPage/AboutPage'),
        {
          serverSideRequirePath: path.resolve(__dirname, './client/components/pages/AboutPage/AboutPage'),
           webpackRequireWeakId: () => require.resolveWeak('./client/components/pages/AboutPage/AboutPage')
         }
      ),
      loading: <div>Loading...</div>
    })
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
