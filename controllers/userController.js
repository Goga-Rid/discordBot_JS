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

async function loadServerGM(client) {
  try {
    const userData = await parseDiscordUsers(client); // Получение данных о пользователях
    await UserModel.deleteMany(); // Очистка коллекции перед сохранением новых данных
    await UserModel.insertMany(userData); // Сохранение данных о пользователях в базу данных
    console.log('Все участники сервера были добавлены в БД');
  } catch (error) {
    console.error('Возникла ошибка при добавлении участников сервера в базу данных:', error);
  }
}

module.exports = { addNewUser, loadServerGM };
