import React from 'react';
import {renderToString, extractModules} from 'react-router-server';
import {StaticRouter} from 'react-router';
import express from 'express';
import compression from'compression';
import path from 'path';
import stats from '../build/public/stats.json';
import App from '../build/server/app';

const app = express();
app.use(compression({
	filter: function (req, res) {
		return true;
	}
}));

app.use(express.static(path.join(__dirname, '..', 'build', 'public')));

let routesCache = {};

app.get('/*', function (req, res) {
	if (!req.url) return;

	const pageFromCache = routesCache[req.url];

	if (pageFromCache) {
		if (pageFromCache.redirectUrl) {
			_redirectTo(res, pageFromCache.redirectUrl);
			return;
		}

		_renderPage(res, pageFromCache);
		return;
	}

	const context = {};
	const server = (
		<StaticRouter
			location={req.url}
			context={context}>
			<App/>
		</StaticRouter>
	);

	renderToString(server)
		.then(({html, state, modules}) => {
			routesCache[req.url] = {
				html,
				state,
				modules,
				redirectUrl: context.url
			};

			if (context.url) {
				_redirectTo(res, context.url);
				return;
			}

			_renderPage(res, {html, state, modules});
		})
		.catch(err => console.error(err));
});

app.listen(3000, function () {
	console.log('Example site listening on 3000!');
});

/// private methods

function _redirectTo(res, redirectUrl) {
	res.writeHead(302, {
		Location: redirectUrl
	});
	res.end();
}

function _renderPage(res, {html, state, modules}) {
	const extracted = extractModules(modules, stats);

	res.render(
		path.join(__dirname, '..', '/build/public/index.ejs'),
		{
			html,
			state,
			files: extracted.map(module => module.files),
			modules: extracted
		}
	);
}
