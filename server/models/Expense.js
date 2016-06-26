const mongoose = require('mongoose');
const Promise = require('bluebird');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const queryPaged = require('./_queryPaged');
const PaymentMethod = require('./PaymentMethod');
const Category = require('./Category');

const expenseSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    validate: {
      validator: (v) => Number.isInteger(v),
      message: 'Quantity "{VALUE}" must be an integer'
    }
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  place: String,
  notes: String,
  _paymentMethod: {
    type: ObjectId,
    ref: 'PaymentMethod'
  },
  _category: {
    type: ObjectId,
    ref: 'Category'
  },
  _user: {
    type: ObjectId,
    ref: 'User'
  }
});

// set defaults
expenseSchema.pre('validate', function(next) {
  if (typeof this.quantity === 'undefined') {
    this.quantity = 1;
  }

  if (typeof this.unitCost === 'undefined') {
    if (typeof this.totalCost !== 'undefined') {
      this.unitCost = this.totalCost / this.quantity;
    } else {
      this.unitCost = 0;
    }
  }

  if (typeof this.totalCost === 'undefined') {
    this.totalCost = this.unitCost * this.quantity;
  }

  if (typeof this.date === 'undefined') {
    this.date = new Date();
  }

  // some actual validation
  if (this.quantity * this.unitCost !== this.totalCost) {
    next(new Error('Quantity * Unit Cost != Total Cost'));
  }

  let validatePaymentMethod = new Promise((resolve, reject) => {
    if (typeof this._paymentMethod !== 'undefined') {
      return PaymentMethod.findOne({
        _user: this._user,
        _id: this._paymentMethod
      }, '_id')
        .then((method) => {
          if (!method) {
            return reject(new Error('Invalid payment method'));
          }
          resolve();
        })
        .catch(reject);
    }
    return resolve();
  });

  let validateCategory = new Promise((resolve, reject) => {
    if (typeof this._category !== 'undefined') {
      return Category.findOne({
        _user: this._user,
        _id: this._category
      }, '_id')
        .then((category) => {
          if (!category) {
            return reject(new Error('Invalid category'));
          }
          resolve();
        })
        .catch(reject);
    }
    return resolve();
  });

  Promise.all([
    validatePaymentMethod,
    validateCategory
  ])
    .then(() => next())
    .catch(next);
});

expenseSchema.statics.queryPaged = queryPaged;

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
