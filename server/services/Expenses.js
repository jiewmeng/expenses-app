const _ = require('lodash');
const validator = require('validator');
const regexDate = /^\d{8} \d{4}$/; // YYYYMMDD HHmm
const moment = require('moment');

module.exports = {
  filter: function(params) {
    let data = _.pick(params, [
      'name',
      'unitCost',
      'totalCost',
      'quantity',
      'category',
      'paymentMethod',
      'date',
      'place',
      'notes'
    ]);

    if (typeof data.quantity === 'undefined') {
      data.quantity = '1';
    }

    if (typeof data.unitCost === 'undefined') {
      if (typeof data.totalCost !== 'undefined') {
        data.unitCost = data.totalCost / data.quantity;
      } else {
        data.unitCost = '0';
      }
    }

    if (typeof data.totalCost === 'undefined') {
      data.totalCost = data.unitCost * data.quantity;
    }

    if (typeof data.date === 'undefined') {
      data.date = moment().format('YYYYMMDD HHmm');
    }

    return data;
  },

  validate: function(params) {
    let errors = {};

    if (typeof params.unitCost !== 'undefined' &&
      !validator.isFloat(params.unitCost, { min: 0 })) {

      errors.unitCost = 'Unit cost should be a non-negative float';
    }

    if (typeof params.quantity !== 'undefined' &&
      !validator.isInt(params.quantity, { min: 0 })) {

      errors.quantity = 'Quantity should be a non negative integer';
    }

    if (typeof params.totalCost !== 'undefined' &&
      !validator.isFloat(params.totalCost, { min: 0 })) {

      errors.totalCost = 'Total cost should be a non-negative float';
    }

    if (!regexDate.test(data.date) || !moment(data.date, 'YYYYMMDD HHmm').isValid()) {
      errors.date = 'Date should be in format YYYYMMDD HHmm';
    }

    if (Object.keys(errors).length > 0) {
      return Promise.reject(new AppError('Invalid expense inputs', 400, errors));
    }
    return Promise.resolve();
  },

  add: function(params) {
    let data = Object.assign({}, params, {
      unitCost: parseFloat(params.unitCost, 10),
      quantity: parseFloat(params.quantity, 10),
      totalCost: parseFloat(params.totalCost, 10),
      date: moment(params.date, 'YYYYMMDD HHmm').toDate()
    });
    return Expense.create(data);
  }
};
