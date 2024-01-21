require('dotenv').config();
const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gif')
    .setDescription('Sends a random gif!'),
  async execute(interaction) {
    const response = await axios({
      method: 'get',
      url: 'https://api.giphy.com/v1/gifs/random',
      params: {
        api_key: process.env.GIFAPI,
      },
    });
    const gifUrl = response.data.data.images.original.url;
    const newAPIEmbed = {
      color: 0x39ff14,
      title: '',
      name: 'Ping',
      image: {
        url: gifUrl,
      },
      description: '',
    };
    const embedData = EmbedBuilder.from(newAPIEmbed);
    await interaction.reply({ embeds: [embedData] });
  },
};
