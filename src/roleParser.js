async function parseDiscordRoles(client) {
  const rolesData = [];

  client.guilds.cache.forEach((guild) => {
    guild.roles.cache.forEach((role) => {
      rolesData.push({ roleName: role.name, roleId: role.id });
    });
  });

  // Возвращаем массив с данными о ролях
  return rolesData;
}

module.exports = { parseDiscordRoles };
