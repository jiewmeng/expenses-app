'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');

module.exports = function(app, url) {
  console.log('Connecting to DB ...');
  mongoose.connect(url);
  let db = mongoose.connection;
  app.context.db = db;

  return new Promise((resolve, reject) => {
    db.once('open', function() {
      console.log('Connected to DB');
      resolve();
    });
    db.on('error', function(err) {
      console.error('DB ERROR', err);
      if (this.isPending()) reject(err);
    });
  });
};
