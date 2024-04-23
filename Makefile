include .env

ENV_MODE=${ENV}

MIGRATOR_ENV_ARGS=# не применимо в окружении production
DOCKER_BEFORE_UP_ARGS=# не применимо в окружении production
DOCKER_AFTER_UP_ARGS=# не применимо в окружении production

ifeq ($(ENV_MODE), development)

MIGRATOR_ENV_ARGS=-v $(PWD)/migrations/db:/app/db
DOCKER_BEFORE_UP_ARGS=-f docker-compose.yml -f docker-compose.local.override.yml

endif

ifeq ($(ENV_MODE), testing)

MIGRATOR_ENV_ARGS=-v $(PWD)/migrations/db:/app/db
DOCKER_BEFORE_UP_ARGS=-f docker-compose.yml -f docker-compose.local.override.yml -f docker-compose.test.override.yml

endif

install:
	@$(MAKE) -s down
	@$(MAKE) -s docker-build
	@docker-compose -p ${DOCKER_PROJECT} up -d mariadb
	@$(MAKE) -s migrate
	@$(MAKE) -s up

up:
	@docker-compose -p ${DOCKER_PROJECT} \
	${DOCKER_BEFORE_UP_ARGS} up -d ${DOCKER_AFTER_UP_ARGS}

down:
	@docker-compose -p ${DOCKER_PROJECT} down --remove-orphans

restart:
	@$(MAKE) -s down
	@$(MAKE) -s up
ps:
	@docker-compose -p ${DOCKER_PROJECT} ps

logs:
	@docker-compose logs -f $(target)

checkout-latest-tag:
	git pull
	latest_tag=$$(git describe --tags $$(git rev-list --tags --max-count=1)); \
	git checkout $$latest_tag

set-latest-version-to-env:
	latest_tag=$$(git describe --tags $$(git rev-list --tags --max-count=1)); \
	sed -i '' "s/^DOCKER_IMAGE_VERSION=.*/DOCKER_IMAGE_VERSION=$$latest_tag/" .env

deploy: \
	checkout-latest-tag \
	set-latest-version-to-env \
	docker-build \
	restart \
	migrate \
	seed

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

docker-build-api-tests:
	@docker build --target=api-tests \
	-t ${DOCKER_REGISTRY}/${DOCKER_API_TESTS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} -f ./docker/Dockerfile .

frontend-publish-dev-dependencies:
	@if [ -d $(PWD)/frontend/nuxtJs/node_modules ]; then rm -r $(PWD)/frontend/nuxtJs/node_modules; fi
	@docker run --rm -d --name frontend_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp frontend_dep_extractor:/app/node_modules $(PWD)/frontend/nuxtJs/node_modules
	@docker stop frontend_dep_extractor

ws-publish-dev-dependencies:
	@if [ -d $(PWD)/websocket/nestJs/node_modules ]; then rm -r $(PWD)/websocket/nestJs/node_modules; fi
	@docker run --rm -d --name ws_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_WS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp ws_dep_extractor:/app/node_modules $(PWD)/websocket/nestJs/node_modules
	@docker stop ws_dep_extractor

api-cli-exec:
	@docker-compose -p ${DOCKER_PROJECT} \
		 -f docker-compose.yml -f docker-compose.local.override.yml run --rm api $(cmd)

api-cli-run-console:
	@$(MAKE) api-cli-exec cmd="yarn run console $(cmd)"

api-publish-dev-dependencies:
	@if [ -d $(PWD)/api/nodeJs/node_modules ]; then rm -r $(PWD)/api/nodeJs/node_modules; fi
	@docker run --rm -d --name api_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_API_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp api_dep_extractor:/app/node_modules $(PWD)/api/nodeJs/node_modules
	@docker stop api_dep_extractor

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
	@if [ -d $(PWD)/migrations/vendor ]; then rm -r $(PWD)/migrations/vendor; fi
	@docker run --rm -d --name migrator_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_MIGRATIONS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp migrator_dep_extractor:/app/vendor $(PWD)/migrations/vendor
	@docker stop migrator_dep_extractor

migrate:
	@$(MAKE) migrator-run cmd="migrate"

seed:
	@$(MAKE) migrator-run cmd="seed:run"

create-migration:
	@$(MAKE) migrator-run cmd="create $(name)"

create-seed:
	@$(MAKE) migrator-run cmd="seed:create $(name)"

api-tests-run:
	@$(MAKE) -s wait-db
	@docker run --network=todo-skill-up_default \
		-e "DB_HOST=${DB_HOST}" \
		-e "DB_PORT=${DB_PORT}" \
		-e "DB_USER=${DB_USER}" \
		-e "DB_PASSWORD=${DB_PASSWORD}" \
		-e "DB_NAME=${DB_NAME}" \
		-v $(PWD)/tests:/app \
		--rm ${DOCKER_REGISTRY}/${DOCKER_API_TESTS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		$(cmd)

api-tests-publish-dev-dependencies:
	@if [ -d $(PWD)/tests/vendor ]; then rm -r $(PWD)/tests/vendor; fi
	@docker run --rm -d --name api_tests_dep_extractor ${DOCKER_REGISTRY}/${DOCKER_API_TESTS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}
	@docker cp api_tests_dep_extractor:/app/vendor $(PWD)/tests/vendor
	@docker stop api_tests_dep_extractor

api-tests-build:
	@$(MAKE) api-tests-run cmd="./vendor/bin/codecept build"

api-tests-run-tests:
	@$(MAKE) restart
	@$(MAKE) migrate
	@$(MAKE) seed
	@$(MAKE) api-tests-run cmd="./vendor/bin/codecept run --steps --debug"

wait-db:
	@docker run --network=todo-skill-up_default \
		--rm ${DOCKER_REGISTRY}/${DOCKER_COMMON_TOOLS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		wait-for ${DB_HOST}:${DB_PORT} -t 0

wait-redis:
	@docker run --network=todo-skill-up_default \
		--rm ${DOCKER_REGISTRY}/${DOCKER_COMMON_TOOLS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		wait-for redis:${REDIS_PORT} -t 0