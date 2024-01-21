const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hi')
    .setDescription('says hello to you)'),
  async execute(interaction) {
    const username = interaction.user.globalName;
    await interaction.reply(`Hello ${username}!`);
  },
};
