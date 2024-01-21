const fs = require('fs');
const path = require('path');

function loadCommands(client, foldersPath) {
  const commandFolders = fs.readdirSync(foldersPath);

  commandFolders.forEach((folder) => {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    commandFiles.forEach((file) => {
      const filePath = path.join(commandsPath, file);
      // eslint-disable-next-line import/no-dynamic-require
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] В команде по адресу ${filePath} отсутствует необходимое свойство "data" или "execute".`);
      }
    });
  });
}

module.exports = {
  loadCommands,
};
