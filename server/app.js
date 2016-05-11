'use strict';

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8000;

let app = require('koa')();
let router = require('koa-router')();
let koaBody = require('koa-body');
let initRouter = require('./util/initRouter');
let routes = require('./routes');
let initDb = require('./util/initDb');
let initConfig = require('./util/initConfig');

app.use(koaBody());
app.use(function*(next) {
  this.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  yield next;
});

app.use(function*(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = {error: err.message};
    this.app.emit('error', err, this);
  }
});

initConfig(app)
  .then(() => {
    return Promise.all([
      initDb(app, app.context.config.db.url),
      initRouter(app, routes)
    ]);
  })
  .then(() => {
    app.listen(PORT);
    console.log(`Server started on ${PORT}`);
  })
  .catch((err) => {
    console.error(`Server failed to start: ${err.message}`);
    console.error(err.stack);
  });

process.on('SIGINT', function() {
  console.log('Disconnecting DB');
  app.context.db.close();
  process.exit(0);
});
