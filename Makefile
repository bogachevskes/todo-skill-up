include .env

ENV_MODE=${ENV}

MIGRATOR_ENV_ARGS=# не применимо в окружении production
DOCKER_UP_ENV_ARGS=# не применимо в окружении production

ifeq ($(ENV_MODE), development)

MIGRATOR_ENV_ARGS=-v $(PWD)/migrations/db:/app/db
DOCKER_UP_ENV_ARGS=-f docker-compose.yml -f docker-compose.local.override.yml

endif

install:
	@$(MAKE) -s down
	@$(MAKE) -s docker-build
	@docker-compose -p ${DOCKER_PROJECT} up -d mariadb
	@$(MAKE) -s migrate
	@$(MAKE) -s up

up:
	@docker-compose -p ${DOCKER_PROJECT} \
	${DOCKER_UP_ENV_ARGS} up -d

down:
	@docker-compose -p ${DOCKER_PROJECT} down --remove-orphans

restart:
	@$(MAKE) -s down
	@$(MAKE) -s up
ps:
	@docker-compose -p ${DOCKER_PROJECT} ps

logs:
	@docker-compose logs -f $(target)

docker-build: \
	docker-build-common-tools \
	docker-build-frontend \
	docker-build-api \
	docker-build-ws \
	docker-build-migrations \
	docker-build-swagger \
	docker-build-nginx

docker-build-common-tools:
	@docker build --target=common-tools \
	-t ${DOCKER_REGISTRY}/${DOCKER_COMMON_TOOLS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f ./docker/Dockerfile .

docker-build-nginx:
	@docker build --target=nginx \
	-t ${DOCKER_REGISTRY}/${DOCKER_NGINX_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f ./docker/Dockerfile .

docker-build-frontend:
	@docker build --target=frontend \
	-t ${DOCKER_REGISTRY}/${DOCKER_FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f ./docker/Dockerfile .

docker-build-api:
	@docker build --target=api \
	-t ${DOCKER_REGISTRY}/${DOCKER_API_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f ./docker/Dockerfile .

docker-build-ws:
	@docker build --target=ws \
	-t ${DOCKER_REGISTRY}/${DOCKER_WS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f ./docker/Dockerfile .

docker-build-migrations:
	@docker build --target=migrations \
	-t ${DOCKER_REGISTRY}/${DOCKER_MIGRATIONS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f ./docker/Dockerfile .

docker-build-swagger:
	@docker build --target=swagger \
	-t ${DOCKER_REGISTRY}/${DOCKER_SWAGGER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f ./docker/Dockerfile .

frontend-publish-dev-dependencies:
	@docker run -d --name frontend_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp frontend_dep_extractor:/app/node_modules $(PWD)/frontend/nuxtJs/node_modules
	@docker rm frontend_dep_extractor

ws-publish-dev-dependencies:
	@docker run -d --name ws_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_WS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp ws_dep_extractor:/app/node_modules $(PWD)/websocket/nestJs/node_modules
	@docker rm ws_dep_extractor

api-cli-exec:
	@docker-compose -p ${DOCKER_PROJECT} \
		 -f docker-compose.yml -f docker-compose.local.override.yml run --rm api $(cmd)

api-cli-run-console:
	@$(MAKE) api-cli-exec cmd="yarn run console $(cmd)"

api-publish-dev-dependencies:
	@docker run -d --name api_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_API_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp api_dep_extractor:/app/node_modules $(PWD)/api/nodeJs/node_modules
	@docker rm api_dep_extractor

migrator-run:
	@$(MAKE) -s wait-db
	@docker run --network=todo-skill-up_default \
		-e "DB_HOST=${DB_HOST}" \
		-e "DB_PORT=${DB_PORT}" \
		-e "DB_USER=${DB_USER}" \
		-e "DB_PASSWORD=${DB_PASSWORD}" \
		-e "DB_NAME=${DB_NAME}" \
		${MIGRATOR_ENV_ARGS} \
		--rm ${DOCKER_REGISTRY}/${DOCKER_MIGRATIONS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		vendor/bin/phinx $(cmd)

migrator-publish-dev-dependencies:
	@docker run -d --name migrator_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_MIGRATIONS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp migrator_dep_extractor:/app/vendor $(PWD)/migrations/vendor
	@docker rm migrator_dep_extractor

migrate:
	@$(MAKE) migrator-run cmd="migrate"

seed:
	@$(MAKE) migrator-run cmd="seed:run"

create-migration:
	@$(MAKE) migrator-run cmd="create $(name)"

create-seed:
	@$(MAKE) migrator-run cmd="seed:create $(name)"

wait-db:
	@docker run --network=todo-skill-up_default \
		--rm ${DOCKER_REGISTRY}/${DOCKER_COMMON_TOOLS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		wait-for mariadb:${DB_PORT} -t 0

wait-redis:
	@docker run --network=todo-skill-up_default \
		--rm ${DOCKER_REGISTRY}/${DOCKER_COMMON_TOOLS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		wait-for redis:${REDIS_PORT} -t 0