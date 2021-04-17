
build: 
	@yarn build

dev:
	@docker-compose down --remove-orphans && \
		docker-compose build --pull && \
		docker-compose \
			-f docker-compose.yml \
		up -d --remove-orphans