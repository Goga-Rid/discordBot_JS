const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping bot command'),
  async execute(interaction) {
    const newAPIEmbed = {
      color: 0x39ff14,
      title: 'Ping bot:',
      name: 'Ping',
      description: 'calculating...',
    };
    const embedData = EmbedBuilder.from(newAPIEmbed);
    const sent = await interaction.reply({ embeds: [embedData], fetchReply: true });
    newAPIEmbed.description = `${sent.createdTimestamp - interaction.createdTimestamp}ms`;
    const updEmbedData = EmbedBuilder.from(newAPIEmbed);
    interaction.editReply({ embeds: [updEmbedData] });
  },
};
