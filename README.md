# React SSR Example


(originally based on https://github.com/erikras/react-redux-universal-hot-example)

---

## About

This is a starter boilerplate app I've put together using the following technologies:

* Isomorphic rendering
* Both client and server make calls to load data from separate API server
* [React](https://github.com/facebook/react)
* [React Router v4](https://github.com/ReactTraining/react-router)
* [Express](http://expressjs.com)
* [Babel](http://babeljs.io) for ES6 and ES7 magic
* [Webpack](http://webpack.github.io) for bundling
* [Webpack Dev Middleware](http://webpack.github.io/docs/webpack-dev-middleware.html)
* [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware)
* [MobX](https://github.com/mobxjs/mobx)
* [style-loader](https://github.com/webpack/style-loader), [sass-loader](https://github.com/jtangelder/sass-loader) to allow import of stylesheets in plain css and sass,
* [react-helmet](https://github.com/nfl/react-helmet) to manage title and meta tag information on both server and client
* [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) to allow require() work for statics both on client and server
* [mocha](https://mochajs.org/) to allow writing unit tests for the project.

## What are the main differences between this starter-kit and [React Redux Universal Hot Example](https://github.com/erikras/react-redux-universal-hot-example)?

### The main distinctive features are:

1. Isomorphic data fetching based on 
[react-router-config](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config).

2. Automated code splitting and lazy loading capability powered by [Webpack](https://github.com/webpack/webpack) 
and [react-loadable](https://github.com/thejameskyle/react-loadable).

3. Static html export with a simple command `npm run static-build`.

4. Server-side rendering for D3.js bar chart via [JSDOM](https://github.com/tmpvar/jsdom).
(for details see also 
[BarChart.js](https://github.com/ArturJS/React-SSR-Example/blob/master/src/client/components/common/BarChart/BarChart.js)
and [ssr.server.js](https://github.com/ArturJS/React-SSR-Example/blob/master/src/server/ssr.server.js))

5. [Preboot.js](https://github.com/angular/preboot) 
for recording and playing back events which were happening 
during the loading of the main scripts 
(when the main application was not bootstrapped).

## Installation

```bash
npm install
```

## Running Dev Server

```bash
npm run dev
```

The first time it may take a little while to generate the first `webpack-assets.json` and complain with a few dozen `[webpack-isomorphic-tools] (waiting for the first Webpack build to finish)` printouts, but be patient. Give it 30 seconds.

## Explanation

What initially gets run is `bin/server.js`, which does little more than enable ES6 and ES7 awesomeness in the
server-side node code. It then initiates `server.js`. In `server.js` we proxy any requests to `/api/*` to the
[API server](#api-server), running at `localhost:3030`. All the data fetching calls from the client go to `/api/*`.
Aside from serving the favicon and static content from `/static`, the only thing `server.js` does is initiate delegate
rendering to `react-router`. At the bottom of `server.js`, we listen to port `3000` and initiate the API server.

#### Images

Now it's possible to render the image both on client and server. Please refer to issue [#39](https://github.com/erikras/react-redux-universal-hot-example/issues/39) for more detail discussion, the usage would be like below (super easy):

```javascript
let logoImage = require('./logo.png');
```

#### Unit Tests

The project uses [Jest](https://facebook.github.io/jest/) as its test runner. 

Jest is a Node-based runner. This means that the tests always run in a Node environment and not in a real browser. This lets us enable fast iteration speed and prevent flakiness.
            
While Jest provides browser globals such as `window` thanks to [jsdom](https://github.com/tmpvar/jsdom), they are only approximations of the real browser behavior. Jest is intended to be used for unit tests of your logic and your components rather than the DOM quirks.
            
We recommend that you use a separate tool for browser end-to-end tests if you need them. They are beyond the scope of Create React App.

### Filename Conventions

Jest will look for test files with any of the following popular naming conventions:

* Files with `.js` suffix in `__tests__` folders.
* Files with `.test.js` suffix.
* Files with `.spec.js` suffix.

The `.test.js` / `.spec.js` files (or the `__tests__` folders) can be located at any depth under the `src` top level folder.

We recommend to put the test files (or `__tests__` folders) next to the code they are testing so that relative imports appear shorter. For example, if `App.test.js` and `App.js` are in the same folder, the test just needs to `import App from './App'` instead of a long relative path. Colocation also helps find tests more quickly in larger projects.

### Command Line Interface

When you run `npm test`, Jest will launch in the watch mode. Every time you save a file, it will re-run the tests, just like `npm start` recompiles the code.

The watcher includes an interactive command-line interface with the ability to run all tests, or focus on a search pattern. It is designed this way so that you can keep it open and enjoy fast re-runs. You can learn the commands from the “Watch Usage” note that the watcher prints after every run:

![Jest watch mode](http://facebook.github.io/jest/img/blog/15-watch.gif)


## TODO
* Add offline capability with [sw-precache](https://github.com/GoogleChromeLabs/sw-precache) 
and proper invalidating of obsolete cache.
* Create webpack plugin for assets generation in runtime. 
Akin to [generate-asset-webpack-plugin](https://github.com/kjbekkelund/generate-asset-webpack-plugin)
but with adding to webpack stats object.
(necessary for runtime generated preboot.js bootstrap script)

## Deployment on Heroku

To get this project to work on Heroku, you need to:

1. Remove the `"PORT": 8080` line from the `betterScripts` / `start-prod` section of `package.json`.
2. `heroku config:set NODE_ENV=production`
3. `heroku config:set NODE_PATH=./src`
4. `heroku config:set NPM_CONFIG_PRODUCTION=false`
  * This is to enable webpack to run the build on deploy.

The first deploy might take a while, but after that your `node_modules` dir should be cached.

## Contributing

I am more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :) 

If you would like to submit a pull request, please make an effort to follow the guide in [CONTRIBUTING.md](CONTRIBUTING.md). 
 
---
Thanks for checking this out.
