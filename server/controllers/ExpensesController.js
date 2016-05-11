const Expense = require('../models/Expense');
const ExpensesService = require('../services/Expenses');

module.exports = {
  /**
   * Gets expenses (paginated) for given user
   */
  index: function*(next) {
    const expenses = yield Expense.find({ user: this.state.user._id }).lean();
    this.body = expenses;
  },

  add: function*(next) {
    const params = ExpensesService.filter(this.request.body);

    yield ExpensesService.validate(params);
    const expense = yield ExpensesService.add(params);
    this.body = expenses;
  }
}
