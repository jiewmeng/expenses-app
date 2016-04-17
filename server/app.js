'use strict';

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8000;

let app = require('koa')();
let router = require('koa-router')();
let parse = require('koa-body');
let initRouter = require('./initRouter');
let routes = require('./routes');

initRouter(app, routes);

app.listen(PORT);
console.log(`Server started on ${PORT}`);
