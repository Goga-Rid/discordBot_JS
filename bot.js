require('dotenv').config();
const path = require('node:path');
const mongoose = require('mongoose');
const {
  Client, Collection, Events, GatewayIntentBits, EmbedBuilder,
} = require('discord.js');
const { loadCommands } = require('./src/commandLoader.js'); // парсер комманд
const { processMessage } = require('./src/messageHandler.js'); // отслеживатель сообщений и выдаватель ролей
// Подключаем модели счетчика сообщений
const foldersPath = path.join(__dirname, 'commands');
const token = process.env.TOKEN; // Вытаскиваем токен
const mongoURL = process.env.MONGOURL; // Вытаскиваем юрл для подключения к БД

// Создание бота и сборщика слэш команд
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

// Подключение к БД
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
    } else {
      await interaction.reply({ content: 'При выполнении этой команды произошла ошибка!', ephemeral: true });
    }
  }
});

// Автоматическое получение приветствия и роли
client.on(Events.GuildMemberAdd, async (member) => {
  // Получение роли, которую нужно выдать новому участнику
  const roleId = '1189672884692603001';
  const role = member.guild.roles.cache.get(roleId);

  // Проверка наличия роли и выдача ее участнику
  if (role) {
    await member.roles.add(role);
  } else {
    console.error(`[ERROR] Роль с ID ${roleId} не найдена.`);
  }

  // Отправка приветственного сообщения в начальный текстовый канал
  const welcomeChannelId = '1098531439382904854';
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
  const gifUrl = 'https://c.tenor.com/X_OSpAg-JzgAAAAd/tenor.gif';
  const newAPIEmbed = {
    color: 0x90EE90,
    image: {
      url: gifUrl,
    },
    title: `**Хтьфу, здарова пон, ${member.user.username}!**`,
    description: `Теперь ты ${role}.`,
  };
  const embedData = EmbedBuilder.from(newAPIEmbed);

  if (welcomeChannel) {
    welcomeChannel.send({ embeds: [embedData] });
  } else {
    console.error(`[ERROR] Канал с ID ${welcomeChannelId} не найден.`);
  }
});

// Добавление роли при достижении определенного кол-ва сообщений
client.on(Events.MessageCreate, async (message) => {
  // Проверяем, что сообщение пришло из гильдии (сервера)
  if (!message.guild) return;

  // Проверяем, что автор сообщения не является ботом
  if (message.author.bot) return;

  // Получаем ID роли из списка, которую нужно выдавать
  const roleMap = {
    '1197916464053768232': 15, // Здесь роли и количество сообщений для этой роли
    '1197916457032482847': 25,
    '1197916460731863082': 50,
    '1197915712421900358': 75,
    '1197916466931044383': 100,
  };

  const promises = [];
  const roleEntries = Object.entries(roleMap);

  roleEntries.forEach(([roleId, requiredMessageCount]) => {
    promises.push(processMessage(message, roleId, requiredMessageCount));
  });

  await Promise.all(promises);
});

// регистрация бота по токену
client.login(token);
