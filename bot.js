require("dotenv").config()
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
let token = process.env.TOKEN; // Вытаскиваем токен

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

	console.log(member.roles)
    // Проверка наличия роли и выдача ее участнику
    if (role) {
		await member.roles.add(role);
    } else {
        console.error(`[ERROR] Роль с ID ${roleId} не найдена.`);
    }

    // Отправка приветственного сообщения в начальный текстовый канал
    const welcomeChannelId = '1098531439382904854';
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

    if (welcomeChannel) {
        welcomeChannel.send(`**Хтьфу, здарова пон, ${member.user.globalName}!** \n Теперь ты ${role}.`);
    } else {
        console.error(`[ERROR] Канал с ID ${welcomeChannelId} не найден.`);
    }
});

// регистрация бота по токену
client.login(token)