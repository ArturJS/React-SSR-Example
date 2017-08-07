# React MobX Universal Hot Example

[![build status](https://img.shields.io/travis/erikras/react-redux-universal-hot-example/master.svg?style=flat-square)](https://travis-ci.org/erikras/react-redux-universal-hot-example)
[![Dependency Status](https://david-dm.org/erikras/react-redux-universal-hot-example.svg?style=flat-square)](https://david-dm.org/erikras/react-redux-universal-hot-example)
[![devDependency Status](https://david-dm.org/erikras/react-redux-universal-hot-example/dev-status.svg?style=flat-square)](https://david-dm.org/erikras/react-redux-universal-hot-example#info=devDependencies)
[![react-redux-universal channel on discord](https://img.shields.io/badge/discord-react--redux--universal%40reactiflux-brightgreen.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bZZb1Ko)
[![Demo on Heroku](https://img.shields.io/badge/demo-heroku-brightgreen.svg?style=flat-square)](https://react-redux.herokuapp.com)
[![PayPal donate button](https://img.shields.io/badge/donate-paypal-brightgreen.svg?style=flat-square)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=E2LK57ZQ9YRMN)

---

## About

This is a starter boilerplate app I've put together using the following technologies:

* ~~Isomorphic~~ [Universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) rendering
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

The project uses [Mocha](https://mochajs.org/) to run your unit tests, it uses [Karma](http://karma-runner.github.io/0.13/index.html) as the test runner, it enables the feature that you are able to render your tests to the browser (e.g: Firefox, Chrome etc.), which means you are able to use the [Test Utilities](http://facebook.github.io/react/docs/test-utils.html) from Facebook api like `renderIntoDocument()`.

To run the tests in the project, just simply run `npm test` if you have `Chrome` installed, it will be automatically launched as a test service for you.

To keep watching your test suites that you are working on, just set `singleRun: false` in the `karma.conf.js` file. Please be sure set it to `true` if you are running `npm test` on a continuous integration server (travis-ci, etc).

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
