install:
	npm ci
lint:
	npx eslint .
fix:
	npx eslint . --fix
start:
	nodemon bot.js
command:
	node deploy-commands.js