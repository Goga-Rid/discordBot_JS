const { parseDiscordRoles } = require('../src/roleParser.js');
const RoleModel = require('../models/roleModel.js');

async function saveRequiredMessageCounts(rolesData) {
  const requiredMessageCounts = {};
  await Promise.all(rolesData.map(async (roleData) => {
    const existingRole = await RoleModel.findOne({ roleId: roleData.roleId });
    if (existingRole) {
      requiredMessageCounts[roleData.roleId] = existingRole.requiredMessageCount;
    }
  }));
  return requiredMessageCounts;
}

async function loadServerRoles(client) {
  try {
    const rolesData = await parseDiscordRoles(client);
    const requiredMessageCounts = await saveRequiredMessageCounts(rolesData);

    const rolesWithMessageCount = rolesData.map((role) => ({
      ...role,
      requiredMessageCount: requiredMessageCounts[role.roleId] || 0,
    }));

    await RoleModel.deleteMany();
    await RoleModel.insertMany(rolesWithMessageCount);
    console.log('Данные о ролях успешно сохранены в базе данных.');
  } catch (error) {
    console.error('Ошибка при сохранении данных о ролях в базу данных:', error);
  }
}

module.exports = { loadServerRoles };
