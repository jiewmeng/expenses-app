'use strict';

const defaultConfig = require('../config/default');
const ENV = process.env.NODE_ENV || 'development';
const fs = require('fs');
const Promise = require('bluebird');
const fsAccess = Promise.promisify(fs.access, {context: fs});
/**
 * Sets app.context.config. Default config (`config/default.js`)
 * is extended with environment config, found in
 * `config/{NODE_ENV}.js` if exists
 *
 * @param {KoaApp} app
 * @return {Promise} resolved when `app.context.config` is set
 */
module.exports = function(app) {
  console.log('Init config ...');
  const envConfigPath = `../config/${ENV}.js`;
  let envConfig = {};

  return fsAccess(envConfigPath, fs.R_OK)
    .then(() => envConfig = require(envConfigPath))
    .catch(() => {/* NOOP */})
    .then(() => {
      console.log('Done init config');
      const config = Object.assign({}, defaultConfig, envConfig);
      app.context.config = config;
    });
};
