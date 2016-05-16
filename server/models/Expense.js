const mongoose = require('mongoose');
const Promise = require('bluebird');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const queryPaged = require('./_queryPaged');

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
  paymentMethod: {type: ObjectId, ref: 'PaymentMethod'},
  _category: {type: ObjectId, ref: 'Category'},
  _user: {type: ObjectId, ref: 'User'}
});

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

  next();
});

expenseSchema.statics.queryPaged = queryPaged;

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
