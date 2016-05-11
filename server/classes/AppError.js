'use strict';

/**
 * AppError from http://stackoverflow.com/a/32749533/292291
 */
class AppError extends Error {
  constructor(message, status, details) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.details = details;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
};

module.exports = AppError;
