install:
	npm ci
lint:
	npx eslint .
fix:
	npx eslint . --fix
start:
	node bot.js
command:
	node deploy-commands.js