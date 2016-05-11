const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  name: String,
  unitCost: Number,
  totalCost: Number,
  quantity: {
    type: Number,
    default: 1
  },
  category: String,
  paymentMethod: String,
  date: {
    type: Date,
    default: Date.now
  },
  place: String,
  notes: String,
  _user: {type: Schema.Types.ObjectId, ref: 'User'}
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
