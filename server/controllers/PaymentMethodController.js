const PaymentMethod = require('../models/PaymentMethod');

module.exports = {
  index: function*(next) {
    const methods = yield PaymentMethod.find({
      _user: this.state.user._id
    }).sort('name').lean();

    this.body = { methods };
  },

  add: function*(next) {
    const params = Object.assign({}, this.request.body, {
      _user: this.state.user._id
    });
    const paymentMethod = yield PaymentMethod.create(params);
    this.body = paymentMethod;
  }
}
