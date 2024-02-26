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
  messageCount: {
    type: Number,
    default: 0,
  },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
