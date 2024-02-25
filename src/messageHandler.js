const { updateMessageCounter } = require('../controllers/messageController.js');

const processMessage = async (message, roleId, requiredMessageCount) => {
  const roleToGive = message.guild.roles.cache.get(roleId);

  if (!roleToGive) {
    console.error(`[ERROR] Роль с ID ${roleId} не найдена.`);
    return;
  }

  const memberId = message.author.id;

  try {
    const counter = await updateMessageCounter(memberId, roleId);

    if (counter.messageCount === requiredMessageCount) {
      await message.member.roles.add(roleToGive);
      message.reply(`Поздравляю! Вы получили роль ${roleToGive.name} за ${requiredMessageCount} сообщений.`);
    }
  } catch (error) {
    console.error('[ERROR] Ошибка при обработке сообщения:', error);
  }
};

module.exports = { processMessage };
