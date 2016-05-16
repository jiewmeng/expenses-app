const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  _user: {type: ObjectId, ref: 'User'}
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
