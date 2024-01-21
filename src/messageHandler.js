const messageCounter = require('../models/messageCounterModel.js');

const processMessage = async (message, roleId, requiredMessageCount) => {
  const roleToGive = message.guild.roles.cache.get(roleId);

  // Проверяем наличие роли
  if (!roleToGive) {
    console.error(`[ERROR] Роль с ID ${roleId} не найдена.`);
    return;
  }

  // Получаем ID участника
  const memberId = message.author.id;

  // Находим или создаем запись для участника и роли в базе данных
  let counter = await messageCounter.findOne({ userId: memberId, roleId });
  if (!counter) {
    counter = await messageCounter.create({ userId: memberId, roleId });
  }

  // Увеличиваем счетчик сообщений для участника и роли
  counter.messageCount += 1;
  await counter.save();

  // Проверяем, достиг ли участник необходимого количества сообщений для данной роли
  if (counter.messageCount === requiredMessageCount) {
    // Выдаем роль участнику
    try {
      await message.member.roles.add(roleToGive);
      message.reply(`Поздравляю! Вы получили роль ${roleToGive.name} за ${requiredMessageCount} сообщений.`);
    } catch (error) {
      console.error(`[ERROR] Ошибка при выдаче роли: ${error}`);
    }
  }
};

module.exports = { processMessage };
