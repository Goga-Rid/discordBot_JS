const { SlashCommandBuilder } = require('discord.js');
const RoleModel = require('../../models/roleModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setrolemessagecount')
    .setDescription('Устанавливает требуемое количество сообщений для получения роли')
    .addRoleOption((option) => option.setName('role')
      .setDescription('Выберите роль')
      .setRequired(true))
    .addIntegerOption((option) => option.setName('messagecount')
      .setDescription('Укажите требуемое количество сообщений')
      .setRequired(true)),
  async execute(interaction) {
    // проверка на роль
    const requiredRoleId = '1189642217376202874';

    if (!requiredRoleId || !interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply('У вас нет прав для использования этой команды.');
    }

    const role = interaction.options.getRole('role');
    const messageCount = interaction.options.getInteger('messagecount');

    // Находим запись о роли в базе данных
    const roleData = await RoleModel.findOne({ roleId: role.id });
    if (!roleData) {
      return interaction.reply({ content: 'Роль не найдена в базе данных.', ephemeral: true });
    }

    // Обновляем значение requiredMessageCount и сохраняем изменения
    roleData.requiredMessageCount = messageCount;
    await roleData.save();

    return interaction.reply({ content: `Значение requiredMessageCount для роли ${role.name} установлено на ${messageCount}.`, ephemeral: true });
  },
};
