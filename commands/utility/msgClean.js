const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('msgcleaner')
    .setDescription('Deletes the number of messages you specified')
    .addIntegerOption((option) => option.setName('amount').setDescription('Number of messages to be deleted').setRequired(true)),
  async execute(interaction) {
    // проверка на роль
    const requiredRoleId = '1189642217376202874';

    if (!requiredRoleId || !interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply('У вас нет прав для использования этой команды.');
    }

    const amount = interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: 'Вы можете удалить от 1 до 99 сообщений за раз', ephemeral: true }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000);
      });
    }

    // удаление сообщений
    const messagesToDelete = await interaction.channel.messages.fetch({ limit: amount });

    if (messagesToDelete.size === 0) {
      return interaction.reply({ content: 'Не удалось найти сообщения для удаления.', ephemeral: true });
    }

    await interaction.channel.bulkDelete(messagesToDelete);
    await interaction.reply({ content: `Успешно удалено ${amount} сообщений`, ephemeral: true }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 5000);
    });
    return null;
  },
};
