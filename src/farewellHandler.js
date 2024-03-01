async function farewellMember(member) {
  const welcomeChannelId = '1098531439382904854';
  const gifUrl = 'https://c.tenor.com/Hz6e-AxE6qoAAAAC/tenor.gif';

  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

  const embedData = {
    color: 0xff0000,
    image: { url: gifUrl },
    title: `**Асуждаю, ${member.user.username}, покинул клетку...**`,
    description: 'Получай пон.',
  };

  if (welcomeChannel) {
    welcomeChannel.send({ embeds: [embedData] });
  } else {
    console.error(`[ERROR] Канал с ID ${welcomeChannelId} не найден.`);
  }
}

module.exports = { farewellMember };
