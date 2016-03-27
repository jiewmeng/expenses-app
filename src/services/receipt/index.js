'use strict';

const service = require('feathers-mongoose');
const receipt = require('./receipt-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: receipt,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/receipts', service(options));

  // Get our initialize service to that we can bind hooks
  const receiptService = app.service('/receipts');

  // Set up our before hooks
  receiptService.before(hooks.before);

  // Set up our after hooks
  receiptService.after(hooks.after);
};
