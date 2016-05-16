const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const paymentMethodSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  _user: {type: ObjectId, ref: 'User'}
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
module.exports = PaymentMethod;
