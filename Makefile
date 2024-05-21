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
compose-prod:
	docker-compose up
compose-dev:
	docker-compose -f docker-compose.override.yml up
compose-clean:
	docker-compose down -v