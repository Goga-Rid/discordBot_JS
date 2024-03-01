const UserModel = require('../models/userModel.js');
const { parseDiscordUsers } = require('../src/userParser.js');

async function addNewUser(member) {
  try {
    await UserModel.create({
      userName: member.user.username,
      userId: member.user.id,
    });
    console.log(`Пользователь ${member.user.username} (${member.user.id}) был добавлен в базу данных.`);
  } catch (error) {
    console.error('Ошибка при добавлении пользователя в базу данных:', error);
  }
}

async function removeUser(member) {
  try {
    await UserModel.deleteMany({ userId: member.user.id });
    console.log(`Пользователь ${member.user.username} (${member.user.id}) был удален из базы данных.`);
  } catch (error) {
    console.error('Ошибка при удалении пользователя из базы данных:', error);
  }
}

async function loadServerGM(client) {
  try {
    const userData = await parseDiscordUsers(client); // Получение данных о пользователях
    await Promise.all(userData.map(async (user) => {
      const existingUser = await UserModel.findOne({ userId: user.userId });
      if (!existingUser) {
        await addNewUser(user);
      }
    }));

    console.log('Проверка и добавление новых пользователей завершено.');
  } catch (error) {
    console.error('Возникла ошибка при добавлении участников сервера в базу данных:', error);
  }
}

module.exports = { addNewUser, removeUser, loadServerGM };
