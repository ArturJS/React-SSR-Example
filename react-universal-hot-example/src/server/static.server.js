import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';

export const initStaticServer = (app) => {
  app.use(compression());
  app.use(favicon(path.join(__dirname, '../..', 'static', 'favicon.ico')));
  app.use(Express.static(path.join(__dirname, '../..', 'static')));
};