const Category = require('../models/Category');
const Promise = require('bluebird');
const AppError = require('../classes/AppError');
const _ = require('lodash');

module.exports = {
  index: function*(next) {
    const categories = yield Category
      .find({ _user: this.state.user._id })
      .sort('name').lean();
    this.body = {categories};
  },

  add: function*(next) {
    const params = Object.assign({}, this.request.body, {
      _user: this.state.user._id
    });
    const category = yield Category.create(params);
    this.body = category;
  },

  edit: function*(next) {
    const params = _.pick(this.request.body, ['name']);
    const condition = {
      _id: this.params.id,
      _user: this.state.user._id
    };
    const category = yield Category.findOne(condition);

    if (!category) throw new AppError('Category not found', 404);
    Object.assign(category, params);
    yield category.save();

    this.response.body = null;
  },

  delete: function*(next) {
    const id = this.params.id;
    const user = this.state.user;

    yield Category.remove({
      _id: id,
      _user: user
    })

    this.response.body = null;
  }
}
