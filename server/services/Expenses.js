const _ = require('lodash');
const validator = require('validator');
const regexDate = /^\d{8} \d{4}$/; // YYYYMMDD HHmm
const moment = require('moment');
const Expense = require('../models/Expense')

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
  
};
