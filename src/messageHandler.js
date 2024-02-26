const UserModel = require('../models/userModel.js');
const RoleModel = require('../models/roleModel.js');

async function handleMessage(message) {
  if (!message.guild || message.author.bot) return;

  try {
    const user = await UserModel.findOne({ userId: message.author.id });
    if (user) {
      user.messageCount += 1;
      await user.save();

      // Получаем все роли из базы данных
      const roles = await RoleModel.find();
      const promises = roles.map(async (roleInfo) => {
        if (user.messageCount === roleInfo.requiredMessageCount) {
          await message.member.roles.add(roleInfo.roleId);
          message.reply(`Поздравляю! Вы получили роль ${roleInfo.roleName} за ${roleInfo.requiredMessageCount} сообщений.`);
        }
      });

      // Ждем выполнения всех промисов
      await Promise.all(promises);
    }
  } catch (error) {
    console.error('Ошибка при обновлении счетчика сообщений пользователя:', error);
  }
}

module.exports = { handleMessage };
