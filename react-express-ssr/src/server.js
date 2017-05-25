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

app.get('/*', function (req, res) {
	if (req.url) {
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
				if (context.url) {
					res.writeHead(302, {
						Location: context.url
					});
					res.end()
				} else {
					const extracted = extractModules(modules, stats);
					res.render(
						path.join(__dirname, '..', '/build/public/index.ejs'),
						{
							html,
							state,
							files: [].concat.apply([], extracted.map(module => module.files)),
							modules: extracted
						}
					);
				}
			})
			.catch(err => console.error(err));
	}
});

app.listen(3000, function () {
	console.log('Example site listening on 3000!');
});
