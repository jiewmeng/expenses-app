'use strict';

const winston = require('winston');
const winstonMongo = require('winston-mongodb');

module.exports = function() {
  let logger = new (winston.Logger)({
    transports: [
      new winston.transports.Console({
        level: 'verbose', 
        prettyPrint: true,
        colorize: true,
        timestamp: false
      }),
      // new winston.transports.MongoDB({
      //   level: 'verbose',
      //   db: 'mongodb://localhost:27017/expenses',
      //   collection: 'logs'
      // })
    ]
  });

  return logger;
};