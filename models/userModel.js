const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
