const mongoose = require('mongoose');

const messageCounterSchema = mongoose.Schema({
  userId: String,
  roleId: { type: String, default: '1098531439382904854' },
  messageCount: { type: Number, default: 0 },
});

const MessageCounter = mongoose.model('MessageCounter', messageCounterSchema);

module.exports = MessageCounter;
