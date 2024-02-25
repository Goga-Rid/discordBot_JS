const mongoose = require('mongoose');

const messageCounterSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  roleId: { type: String, required: true },
  messageCount: { type: Number, default: 0 }, // Добавляем дефолтное значение для счетчика сообщений
});

const MessageCounterModel = mongoose.model('MessageCounter', messageCounterSchema);

module.exports = MessageCounterModel;
