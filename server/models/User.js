const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  displayName: String,
  googleId: String,
  githubId: String,
  email: String,
  image: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
