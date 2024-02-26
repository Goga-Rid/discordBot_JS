const { SlashCommandBuilder } = require('discord.js');
const UserModel = require('../../models/userModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset-message-count')
    .setDescription('Обнуляет счетчик сообщений у указанного пользователя')
    .addUserOption((option) => option.setName('user')
      .setDescription('Выберите пользователя')
      .setRequired(true)),
  async execute(interaction) {
    // Проверяем наличие роли у пользователя
    const requiredRoleId = '1189642217376202874'; // Замените на ID роли, которая дает доступ к команде

    if (!interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply('У вас нет прав для использования этой команды.');
    }

    // Получаем пользователя, для которого нужно сбросить messageCount
    const targetUser = interaction.options.getUser('user');

    try {
      // Находим запись в базе данных по userId и обнуляем messageCount
      await UserModel.updateOne({ userId: targetUser.id }, { $set: { messageCount: 0 } });
      await interaction.reply({ content: `Счетчик сообщений для пользователя ${targetUser.username} успешно обнулен!`, ephemeral: true });
    } catch (error) {
      console.error('Произошла ошибка при сбросе счетчика сообщений:', error);
      await interaction.reply({ content: 'Произошла ошибка при сбросе счетчика сообщений!', ephemeral: true });
    }
    return null;
  },
};
