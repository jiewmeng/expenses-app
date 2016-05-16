const Category = require('../models/Category');
const Promise = require('bluebird');

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
  }
}
