const PaymentMethod = require('../models/PaymentMethod');

module.exports = {
  index: function*(next) {
    const methods = yield PaymentMethod.find({
      _user: this.state.user._id
    }).sort('name').lean();

    this.body = methods;
  },

  add: function*(next) {
    const params = Object.assign({}, this.request.body, {
      _user: this.state.user._id
    });
    const paymentMethod = yield PaymentMethod.create(params);
    this.body = paymentMethod;
  },

  edit: function*(next) {
    const params = _.pick(this.request.body, ['name']);
    const condition = {
      _id: this.params.id,
      _user: this.state.user._id
    };
    const method = yield PaymentMethod.findOne(condition);

    if (!method) throw new AppError('Payment method not found', 404);
    Object.assign(method, params);
    yield method.save();

    this.response.body = null;
  },

  delete: function*(next) {
    const id = this.params.id;
    const user = this.state.user;

    yield PaymentMethod.remove({
      _id: id,
      _user: user
    })

    this.response.body = null;
  }
}
