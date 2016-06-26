'use strict';

const Promise = require('bluebird');

/**
 * Matches a valid route eg. `post /article/1`
 */
const REGEX_ROUTE_DEFINATION = /^(get|post|put|delete) (.*)$/;

/**
 * Matches a valid contoller action eg `AppController.index`
 */
const REGEX_ROUTE_MIDDLEWARE = /^([^.]+)\.(.*)$/;

/**
 * Parse a route defination eg. `get /posts`
 * @param  {string} routeDfn
 * @return {object} with keys { method, url }
 */
const parseRouteDfn = function(routeDfn) {
  let routeMatches = REGEX_ROUTE_DEFINATION.exec(routeDfn);
  if (!routeMatches) {
    throw new Error(`Error parsing route "${routeDfn}"`);
  }
  let method = routeMatches[1];
  let url = routeMatches[2];
  return { method, url };
};

/**
 * Parse a route action defination
 * @param  {String|Array} routeActionDfn a string like `AppController.index` or an array of these
 * @return {Array} an array of { controller, action }
 */
const parseRouteActions = function(routeActionDfn) {
  let routeActions = routeActionDfn;

  if (!(routeActions instanceof Array)) {
    routeActions = [routeActions];
  }

  return routeActions.map(function(actionDfn) {
    let middlewareMatches = REGEX_ROUTE_MIDDLEWARE.exec(actionDfn);
    if (!middlewareMatches) {
      throw new Error(`Error parsing route controller action ${actionDfn}`);
    }
    let controller = middlewareMatches[1];
    let action = middlewareMatches[2];
    return {controller, action};
  });
}

/**
 * Router initalizer
 * @param {KoaApp} app Koa app
 */
module.exports = function(app, routes) {
  let router = require('koa-router')();

  Object.keys(routes).forEach(function(routeDfn) {
    let route = parseRouteDfn(routeDfn);
    let routeActions = parseRouteActions(routes[routeDfn]);
    let middlewares = routeActions.map((handler) => {
      let controller = require(`../controllers/${handler.controller}`);
      if (!controller.hasOwnProperty(handler.action)) {
        throw new Error(`Route Invalid: "${route.method} ${route.url}": Controller action "${handler.action}" not found in "${handler.controller}"`)
      }
      return controller[handler.action];
    });

    console.log(`DEBUG ROUTER: ${route.method} ${route.url}`)
    router[route.method](route.url, ...middlewares);
  });

  app.use(router.routes())
    .use(router.allowedMethods());

  return Promise.resolve();
};
