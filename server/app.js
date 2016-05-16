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
const AppError = require('./classes/AppError');

app.use(function*(next) {
  try {
    yield next;
  } catch (err) {
    let details = {};

    if (err.name === 'ValidationError') {
      this.status = 400;
      console.log(err)
      Object.keys(err.errors).forEach((k) => {
        details[k] = err.errors[k].message;
      });
    } else {
      this.status = 500;
    }

    this.body = {
      error: err.message,
      details
    };
    this.app.emit('error', err, this);
  }
});

app.use(koaBody());
app.use(function*(next) {
  this.set('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);
  this.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  if (this.request.type !== 'application/json' && /^(POST|PUT)$/i.test(this.method)) throw new AppError('Content-Type should be application/json for POST/PUT methods', 400);
  yield next;
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
