async function greetNewMember(member) {
  const roleId = '1189672884692603001';
  const welcomeChannelId = '1098531439382904854';
  const gifUrl = 'https://c.tenor.com/X_OSpAg-JzgAAAAd/tenor.gif';

  const role = member.guild.roles.cache.get(roleId);
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

  if (role) {
    await member.roles.add(role);
  } else {
    console.error(`[ERROR] Роль с ID ${roleId} не найдена.`);
  }

  const embedData = {
    color: 0x90EE90,
    image: { url: gifUrl },
    title: `**Хтьфу, здарова пон, ${member.user.username}!**`,
    description: `Теперь ты ${role}.`,
  };

  if (welcomeChannel) {
    welcomeChannel.send({ embeds: [embedData] });
  } else {
    console.error(`[ERROR] Канал с ID ${welcomeChannelId} не найден.`);
  }
}

module.exports = { greetNewMember };
