const { SlashCommandBuilder } = require('discord.js');
const MessageCounterModel = require('../../models/messageCounterModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset-message-count')
    .setDescription('Обнуляет счетчик сообщений у указанного пользователя')
    .addUserOption((option) => option.setName('user')
      .setDescription('Выберите пользователя')
      .setRequired(true)),
  async execute(interaction) {
    // проверка на роль
    const requiredRoleId = '1189642217376202874';

    if (!requiredRoleId || !interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply('У вас нет прав для использования этой команды.');
    }

    // Получаем пользователя, для которого нужно сбросить messageCount
    const targetUser = interaction.options.getUser('user');

    try {
      // Находим запись в базе данных по userId и обнуляем messageCount
      await MessageCounterModel.updateOne({ userId: targetUser.id }, { $set: { messageCount: 0 } });
      if (!interaction.replied) {
        await interaction.reply({ content: `Счетчик сообщений для пользователя ${targetUser.username} успешно обнулен!`, ephemeral: true });
      }
    } catch (error) {
      await interaction.reply({ content: 'Произошла ошибка при сбросе счетчика сообщений!', ephemeral: true });
    }
    return null;
  },
};
