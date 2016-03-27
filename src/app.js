'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const readdir = Promise.promisify(fs.readdir);
const staticFiles = require('koa-static');
const koaWinston = require('koa-winston');
const koaBody = require('koa-body');
const views = require('koa-views');

const createLogger = require('./misc/createLogger.js');
const handleErrors = require('./middlewares/handleErrors');
const handle404Errors = require('./middlewares/handle404Errors');

let app = require('koa')();

app.use(koaWinston(createLogger()));
app.use(handleErrors);
app.use(handle404Errors);

app.use(staticFiles(path.resolve(`${__dirname}/../build`)));
app.use(koaBody());
app.use(views(`${__dirname}/views`, {
  map: {
    jade: 'jade'
  },
  extension: 'jade'
}));

Promise.coroutine(function *() {
  const routerDir = `${__dirname}/routers`;
  let routerFiles = yield readdir(routerDir);
  yield Promise.map(routerFiles, function(file) {
    let routes = require(`${routerDir}/${file}`);
    let router = require('koa-router')();

    Object.keys(routes).forEach(function(route) {
      let matches = /^(get|post|put|patch|delete) (.*)$/.exec(route);
      if (!matches) throw new Error(`Error parsing routes: ${route}`);

      router[matches[1]](matches[2], routes[route]);
    })

    app
      .use(router.routes())
      .use(router.allowedMethods());
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT);
  console.log(`Server listening on ${PORT}`);
})();
