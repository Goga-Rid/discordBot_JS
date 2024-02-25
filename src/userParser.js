async function parseDiscordUsers(client) {
  const usersData = [];

  await Promise.all(client.guilds.cache.map(async (guild) => {
    const members = await guild.members.fetch();
    members.forEach((member) => {
      const userName = member.user.globalName || member.user.username;
      usersData.push({ userId: member.user.id, userName });
    });
  }));

  // Возвращаем массив с данными о пользователях
  return usersData;
}

module.exports = { parseDiscordUsers };
