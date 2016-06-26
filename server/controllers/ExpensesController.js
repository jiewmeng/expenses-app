const Expense = require('../models/Expense');
const ExpensesService = require('../services/Expenses');
const Promise = require('bluebird');
const _ = require('lodash');

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
      paginationCondition,
      populate: [
        '_paymentMethod',
        '_category'
      ]
    });
    this.body = data;
  },

  add: function*(next) {
    const params = Object.assign({}, this.request.body, {
      _user: this.state.user._id,
      _paymentMethod: this.request.body.paymentMethod,
    });
    const expense = yield Expense.create(params);
    this.body = expense;
  },

  edit: function*(next) {
    const params = _.pick(this.request.body, [
      'name', 'unitCost', 'totalCost', 'quantity',
      'date', 'place', 'notes', 'paymentMethod', 'category']);
    if (params.paymentMethod) params._paymentMethod = params.paymentMethod;
    if (params.category) params._category = params.category;
    const condition = {
      _id: this.params.id,
      _user: this.state.user._id
    };
    const expense = yield Expense.findOne(condition);

    if (!expense) throw new AppError('Expense not found', 404);

    Object.assign(expense, params);
    yield expense.save();

    this.response.body = null;
  },

  delete: function*(next) {
    const id = this.params.id;
    const user = this.state.user;

    yield Expense.remove({
      _id: id,
      _user: user
    })

    this.response.body = null;
  }
}
