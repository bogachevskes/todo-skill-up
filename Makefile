include .env

install:
	@$(MAKE) -s down
	@$(MAKE) -s docker-build
	@$(MAKE) -s frontend-install
	@$(MAKE) -s api-install
	@$(MAKE) -s api-build
	@$(MAKE) -s ws-install
	@$(MAKE) -s migration-install
	@docker-compose -p ${PROJECT} up -d mariadb
	@$(MAKE) -s waitdb
	@$(MAKE) -s migrate
	@$(MAKE) -s up


up: docker-up

docker-up:
	@docker-compose -p ${PROJECT} up -d --scale api-cli=0 --scale migrations=0

down: docker-down

docker-down:
	@docker-compose -p ${PROJECT} down --remove-orphans

restart:
	@$(MAKE) -s down
	@$(MAKE) -s up
ps:
	@docker-compose -p ${PROJECT} ps

logs:
	@docker-compose logs -f

docker-build: \
	docker-build-frontend \
	docker-build-api \
	docker-build-api-cli \
	docker-build-ws \
	docker-build-migrations \
	docker-build-swagger \
	docker-build-nginx

docker-build-nginx:
	@docker build --target=nginx \
	--build-arg NGINX_PORT=${NGINX_PORT} \
	-t ${REGISTRY}/todo-skill-up-nginx:${IMAGE_TAG} -f ./docker/Dockerfile .

docker-build-frontend:
	@docker build --target=frontend \
	-t ${REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG} -f ./docker/Dockerfile .

docker-build-api-cli:
	@docker build --target=api-cli \
	-t ${REGISTRY}/${API_CLI_IMAGE}:${IMAGE_TAG} -f ./docker/Dockerfile .

docker-build-api:
	@docker build --target=api \
	-t ${REGISTRY}/${API_IMAGE}:${IMAGE_TAG} -f ./docker/Dockerfile .

docker-build-ws:
	@docker build --target=ws \
	-t ${REGISTRY}/${WS_IMAGE}:${IMAGE_TAG} -f ./docker/Dockerfile .

docker-build-migrations:
	@docker build --target=migrations \
	-t ${REGISTRY}/${MIGRATIONS_IMAGE}:${IMAGE_TAG} -f ./docker/Dockerfile .

docker-build-swagger:
	@docker build --target=swagger \
	-t ${REGISTRY}/todo-skill-up-swagger:${IMAGE_TAG} -f ./docker/Dockerfile .

frontend-install:
	@docker-compose -p ${PROJECT} run --rm frontend yarn install --no-bin-links

api-install:
	@docker-compose -p ${PROJECT} run --rm --no-deps api-cli yarn install --no-bin-links

# не работает, исправить
api-build:
	@docker-compose -p ${PROJECT} run --rm --no-deps api-cli yarn run build

api-node-exec:
	@docker-compose -p ${PROJECT} run --rm api-cli $(cmd)

ws-install:
	@docker-compose -p ${PROJECT} run --rm --no-deps ws yarn install --no-bin-links

migration-install:
	@docker-compose -p ${PROJECT} run --rm --no-deps migrations composer install

migrate:
	@docker-compose -p ${PROJECT} run --rm migrations vendor/bin/phinx migrate

seed:
	@docker-compose -p ${PROJECT} run --rm migrations vendor/bin/phinx seed:run

create-migration:
	@docker-compose -p ${PROJECT} run --rm migrations vendor/bin/phinx create $(name)

create-seed:
	@docker-compose -p ${PROJECT} run --rm migrations vendor/bin/phinx seed:create $(name)

waitdb:
	@docker-compose -p ${PROJECT} run --rm migrations wait-for mariadb:${DB_PORT} -t 0