const MessageCounterModel = require('../models/messageCounterModel.js');

async function updateMessageCounter(userId, roleId) {
  try {
    let counter = await MessageCounterModel.findOne({ userId, roleId });

    if (!counter) {
      counter = await MessageCounterModel.create({ userId, roleId });
    }

    counter.messageCount += 1;
    await counter.save();

    return counter;
  } catch (error) {
    console.error('Ошибка при обновлении счетчика сообщений:', error);
    throw error;
  }
}

module.exports = { updateMessageCounter };
