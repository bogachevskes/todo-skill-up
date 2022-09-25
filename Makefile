include docker.env

INFRASTRUCTURE_COMPOSE_PROJECT_NAME=todo-skill-up-infrastructure
FRONTEND_NUXT_COMPOSE_PROJECT_NAME=todo-skill-up-frontend-nuxt
API_NODE_COMPOSE_PROJECT_NAME=todo-skill-up-api-node
WS_NEST_COMPOSE_PROJECT_NAME=todo-skill-up-ws-nest

INFRASTRUCTURE_REDIS=infrastructure-redis
FRONTEND_NUXT_NODE_CLI=frontend-nuxt-node-cli
API_NODE_CLI=api-node-cli
WS_NEST_CLI=ws-nest-cli

# ============================== BEGIN COMMON COMMANDS ================================== #

up-nuxt-node: up-infrastructure \
	up-frontend-nuxt \
	up-api-node \
	up-ws-nest

# ============================== END COMMON COMMANDS ==================================== #

# ============================== BEGIN INFRASTRUCTURE =================================== #

infrastructure-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-infrastructure.yml -p ${INFRASTRUCTURE_COMPOSE_PROJECT_NAME} ps

infrastructure-docker-logs:
	@docker-compose --env-file ./docker.env -f docker-compose-infrastructure.yml -p ${INFRASTRUCTURE_COMPOSE_PROJECT_NAME} logs -f

up-infrastructure:
	@docker-compose --env-file ./docker.env -f docker-compose-infrastructure.yml -p ${INFRASTRUCTURE_COMPOSE_PROJECT_NAME} up -d --remove-orphans

down-infrastructure:
	@docker-compose --env-file ./docker.env -f docker-compose-infrastructure.yml -p ${INFRASTRUCTURE_COMPOSE_PROJECT_NAME} down --remove-orphans

infrastructure-redis-cli:
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml -p ${INFRASTRUCTURE_COMPOSE_PROJECT_NAME} exec $(INFRASTRUCTURE_REDIS) redis-cli

# ============================== END INFRASTRUCTURE =================================== #

# ============================== BEGIN FRONTEND NUXT =================================== #

frontend-nuxt-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-nuxt.yml -p ${FRONTEND_NUXT_COMPOSE_PROJECT_NAME} ps

frontend-nuxt-docker-logs:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-nuxt.yml -p ${FRONTEND_NUXT_COMPOSE_PROJECT_NAME} logs -f

up-frontend-nuxt:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-nuxt.yml -p ${FRONTEND_NUXT_COMPOSE_PROJECT_NAME} up -d --remove-orphans

down-frontend-nuxt:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-nuxt.yml -p ${FRONTEND_NUXT_COMPOSE_PROJECT_NAME} down --remove-orphans

restart-frontend-nuxt: down-frontend-nuxt \
	up-frontend-nuxt

docker-build-frontend-nuxt: docker-build-frontend-nuxt-app \
	docker-build-frontend-nuxt-node-cli

docker-build-frontend-nuxt-app:
	@docker build -t ${REGISTRY}/todo-skill-up-frontend-nuxt:${IMAGE_TAG} \
		-f frontend/nuxtJs/docker/${ENV}/node-app/Dockerfile frontend/nuxtJs/docker

docker-build-frontend-nuxt-node-cli:
	@docker build -t ${REGISTRY}/todo-skill-up-frontend-nuxt-node-cli:${IMAGE_TAG} \
		-f frontend/nuxtJs/docker/${ENV}/node-cli/Dockerfile frontend/nuxtJs/docker

frontend-nuxt-init: frontend-nuxt-yarn-install frontend-nuxt-yarn-build

frontend-nuxt-node-exec:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-nuxt.yml -p ${FRONTEND_NUXT_COMPOSE_PROJECT_NAME} run --rm $(FRONTEND_NUXT_NODE_CLI) $(cmd)

frontend-nuxt-yarn-install:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn install --no-bin-links"
	$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-add:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn add $(package) --no-bin-links"
	$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-remove:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn remove $(package)"
	$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-dev:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn run dev"
	@$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-build:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn run build"
	@$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-start:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn run start"
	@$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-lint-js:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn run lint:js"
	@$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-lint-prettier:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn run lint:prettier"
	@$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-lint:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn run lint"
	@$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-yarn-lintfix:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn run lintfix"
	@$(MAKE) -s frontend-nuxt-chown

frontend-nuxt-chown:
	$(MAKE) frontend-nuxt-node-exec cmd="chown -R 1000:1000 ./"

frontend-nuxt-node-shell:
	$(MAKE) frontend-nuxt-node-exec cmd="sh"

# ============================== END FRONTEND NUXT =================================== #

# ============================== BEGIN API NodeJs =================================== #

api-node-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml -p ${API_NODE_COMPOSE_PROJECT_NAME} ps

api-node-docker-logs:
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml -p ${API_NODE_COMPOSE_PROJECT_NAME} logs -f

up-api-node:
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml -p ${API_NODE_COMPOSE_PROJECT_NAME} up -d --remove-orphans

down-api-node:
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml -p ${API_NODE_COMPOSE_PROJECT_NAME} down --remove-orphans

docker-build-api-node: docker-build-api-node-app \
	docker-build-api-node-cli

docker-build-api-node-app:
	@docker build -t ${REGISTRY}/todo-skill-up-api-node:${IMAGE_TAG} \
		-f api/nodeJs/docker/${ENV}/node-app/Dockerfile api/nodeJs/docker

docker-build-api-node-cli:
	@docker build -t ${REGISTRY}/todo-skill-up-api-node-cli:${IMAGE_TAG} \
		-f api/nodeJs/docker/${ENV}/node-cli/Dockerfile api/nodeJs/docker

api-node-init: api-node-yarn-install api-node-yarn-build

api-node-exec:
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml -p ${API_NODE_COMPOSE_PROJECT_NAME} run --rm $(API_NODE_CLI) $(cmd)

api-node-yarn-install:
	$(MAKE) api-node-exec cmd="yarn install --no-bin-links"
	$(MAKE) -s api-node-chown

api-node-yarn-add:
	$(MAKE) api-node-exec cmd="yarn add $(package) --no-bin-links"
	$(MAKE) -s api-node-chown

api-node-yarn-remove:
	$(MAKE) api-node-exec cmd="yarn remove $(package)"
	$(MAKE) -s api-node-chown

api-node-yarn-build:
	$(MAKE) api-node-exec cmd="yarn run build"
	@$(MAKE) -s api-node-chown

api-node-chown:
	$(MAKE) api-node-exec cmd="chown -R 1000:1000 ./"

api-node-shell:
	$(MAKE) api-node-exec cmd="sh"

api-node-app-cli:
	$(MAKE) api-node-exec cmd="yarn run console $(cmd)"

rebuild-api-node-app: down-api-node \
	api-node-yarn-build \
	up-api-node

# ============================== END API NodeJs =================================== #

# ============================== BEGIN WS NestJs =================================== #

ws-nest-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-nest.yml -p ${WS_NEST_COMPOSE_PROJECT_NAME} ps

ws-nest-docker-logs:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-nest.yml -p ${WS_NEST_COMPOSE_PROJECT_NAME} logs -f

up-ws-nest:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-nest.yml -p ${WS_NEST_COMPOSE_PROJECT_NAME} up -d --remove-orphans

down-ws-nest:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-nest.yml -p ${WS_NEST_COMPOSE_PROJECT_NAME} down --remove-orphans

restart-ws-nest-app: down-ws-nest \
	up-ws-nest

restart-ws-nest: down-ws-nest \
	up-ws-nest

docker-build-ws-nest: docker-build-ws-nest-app \
	docker-build-ws-nest-cli

docker-build-ws-nest-app:
	@docker build -t ${REGISTRY}/todo-skill-up-ws-nest:${IMAGE_TAG} \
		-f websocket/nestJs/docker/${ENV}/node-app/Dockerfile websocket/nestJs/docker

docker-build-ws-nest-cli:
	@docker build -t ${REGISTRY}/todo-skill-up-ws-nest-cli:${IMAGE_TAG} \
		-f websocket/nestJs/docker/${ENV}/node-cli/Dockerfile websocket/nestJs/docker

ws-nest-init: ws-nest-yarn-install ws-nest-yarn-build

ws-nest-exec:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-nest.yml -p ${WS_NEST_COMPOSE_PROJECT_NAME} run --rm $(WS_NEST_CLI) $(cmd)

ws-nest-yarn-install:
	$(MAKE) ws-nest-exec cmd="yarn install --no-bin-links"
	$(MAKE) -s ws-nest-chown

ws-nest-yarn-add:
	$(MAKE) ws-nest-exec cmd="yarn add $(package) --no-bin-links"
	$(MAKE) -s ws-nest-chown

ws-nest-yarn-remove:
	$(MAKE) ws-nest-exec cmd="yarn remove $(package)"
	$(MAKE) -s ws-nest-chown

ws-nest-yarn-build:
	$(MAKE) ws-nest-exec cmd="yarn run build"
	@$(MAKE) -s ws-nest-chown

ws-nest-chown:
	$(MAKE) ws-nest-exec cmd="chown -R 1000:1000 ./"

ws-nest-shell:
	$(MAKE) ws-nest-exec cmd="sh"

ws-nest-app-cli:
	$(MAKE) ws-nest-exec cmd="$(cmd)"

# ============================== END WS NestJs =================================== #