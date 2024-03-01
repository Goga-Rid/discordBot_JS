require('dotenv').config();
const path = require('node:path');
const {
  Client, Collection, Events, GatewayIntentBits,
} = require('discord.js');
const { loadCommands } = require('./src/commandLoader.js'); // парсер комманд
const { handleMessage } = require('./src/messageHandler.js'); // отслеживатель сообщений (увеличение счетчика сообщений) и выдаватель ролей
const { greetNewMember } = require('./src/greetHandler.js'); // обработчик приветсвтвия нового пользователя
const { farewellMember } = require('./src/farewellHandler.js'); // обработчик прощания с пользователем
const { connectDatabase, initializeModels } = require('./src/db.js'); // Подключаем модуль для работы с базой данных
const { loadServerRoles } = require('./controllers/roleController.js'); // Контроллер для загрузки ролей сервера
const { loadServerGM, removeUser, addNewUser } = require('./controllers/userController.js'); // Контроллер для загрузки пользователей сервера

const foldersPath = path.join(__dirname, 'commands');
const token = process.env.TOKEN; // Вытаскиваем токен

// Инициализация бота
const client = new Client({
  allowedMentions: {
    parse: ['users', 'roles'],
    repliedUser: true,
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Подключение к БД и инициализация моделей
connectDatabase();
initializeModels();

// Парсинг команд с директории где лежат команды
client.commands = new Collection();
loadCommands(client, foldersPath);

// Получение команд ботом и обработка ошибок
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Соответствующая команда ${interaction.commandName} не была найдена.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'При выполнении этой команды произошла ошибка!', ephemeral: true });
    }
  }
});

// Автоматическое получение приветствия и роли
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    // Добавление информации о новом участнике в базу данных
    await greetNewMember(member);
    await addNewUser(member);
  } catch (error) {
    console.error('Ошибка при добавлении пользователя в базу данных:', error);
  }
});

// Автоматическое прощание с пользователем
client.on(Events.GuildMemberRemove, async (member) => {
  try {
    await farewellMember(member);
    await removeUser(member);
  } catch (error) {
    console.error('Ошибка при удалении пользователя из базы данных:', error);
  }
});

// Добавление роли при достижении определенного кол-ва сообщений
client.on(Events.MessageCreate, async (message) => {
  handleMessage(message);
});

// Парсинг ролей при запуске бота и запись бд с самоочисткой
client.once('ready', async () => {
  try {
    await loadServerRoles(client);
    await loadServerGM(client);
    console.log('Бот запущен!');
  } catch (error) {
    console.error(`Бот был запущен с ошибкой парсинга: ${error}`);
  }
});

// регистрация бота по токену
client.login(token);
