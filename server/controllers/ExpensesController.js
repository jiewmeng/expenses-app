const Expense = require('../models/Expense');
const ExpensesService = require('../services/Expenses');
const Promise = require('bluebird');

module.exports = {
  /**
   * Gets expenses (paginated) for given user
   */
  index: function*(next) {
    const queryParams = this.request.query;
    let paginationCondition = {};

    if (typeof queryParams.lt === 'string') {
      paginationCondition._id = { $lt: queryParams.lt };
    }

    const data = yield Expense.queryPaged({
      findQuery: { _user: this.state.user._id },
      sort: '-_id',
      paginationCondition
    });
    this.body = data;
  },

  add: function*(next) {
    const params = Object.assign({}, this.request.body, {
      _user: this.state.user._id
    });
    const expense = yield Expense.create(params);
    this.body = expense;
  }
}
