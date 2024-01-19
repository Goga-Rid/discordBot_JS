require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const messageCounter = require('./models/messageCounterModel.js'); // Подключаем модели счетчика сообщений
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
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
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] В команде по адресу ${filePath} отсутствует необходимое свойство "data" или "execute".`);
		}
	}
}

// Получение команд ботом и обработка ошибок
client.on(Events.InteractionCreate, async interaction => {
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
client.on(Events.GuildMemberAdd, async member => { 
	
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
        welcomeChannel.send({ embeds: [embedData]});
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

	for (const [roleId, requiredMessageCount] of Object.entries(roleMap)) {
		const roleToGive = message.guild.roles.cache.get(roleId);
	
  
	// Проверяем наличие роли
	if (!roleToGive) {
	console.error(`[ERROR] Роль с ID ${roleId} не найдена.`);
	continue;// Пропускаем текущую итерацию, если роль не найдена;
	}
  
	// Получаем ID участника
	const memberId = message.author.id;
  
	// Находим или создаем запись для участника и роли в базе данных
	let counter = await messageCounter.findOne({ userId: memberId, roleId });
    if (!counter) {
      counter = await messageCounter.create({ userId: memberId, roleId });
    }

	
    // Увеличиваем счетчик сообщений для участника и роли
    counter.messageCount+=1;
    await counter.save();

    // Проверяем, достиг ли участник необходимого количества сообщений для данной роли
    if (counter.messageCount === requiredMessageCount) {
      // Выдаем роль участнику
      try {
        await message.member.roles.add(roleToGive);
        message.reply(`Поздравляю! Вы получили роль ${roleToGive.name} за ${requiredMessageCount} сообщений.`);
      } catch (error) {
        console.error(`[ERROR] Ошибка при выдаче роли: ${error}`);
      }
    }
  }
});

// регистрация бота по токену
client.login(token)