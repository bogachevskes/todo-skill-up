include docker.env

FRONTEND_VUE_COMPOSE_PROJECT_NAME=todo-skill-up-frontend-vue
FRONTEND_NUXT_COMPOSE_PROJECT_NAME=todo-skill-up-frontend-nuxt
API_NODE_COMPOSE_PROJECT_NAME=todo-skill-up-api-node
WS_NODE_COMPOSE_PROJECT_NAME=todo-skill-up-ws-node

FRONTEND_VUE_NODE_CLI=frontend-vue-node-cli
FRONTEND_NUXT_NODE_CLI=frontend-nuxt-node-cli
API_NODE_CLI=api-node-cli
WS_NODE_CLI=ws-node-cli

# ============================== BEGIN FRONTEND VUE =================================== #

frontend-vue-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-vue.yml -p ${FRONTEND_VUE_COMPOSE_PROJECT_NAME} ps

up-frontend-vue:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-vue.yml -p ${FRONTEND_VUE_COMPOSE_PROJECT_NAME} up -d --remove-orphans

down-frontend-vue:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-vue.yml -p ${FRONTEND_VUE_COMPOSE_PROJECT_NAME} down --remove-orphans

restart-frontend-vue: down-frontend-vue \
	up-frontend-vue

docker-build-frontend-vue: docker-build-frontend-vue-app \
	docker-build-frontend-vue-node-cli

docker-build-frontend-vue-app:
	@docker build -t ${REGISTRY}/todo-skill-up-frontend-vue:${IMAGE_TAG} \
		-f frontend/vueJs/docker/${ENV}/nginx/Dockerfile frontend/vueJs/docker

docker-build-frontend-vue-node-cli:
	@docker build -t ${REGISTRY}/todo-skill-up-frontend-vue-node-cli:${IMAGE_TAG} \
		-f frontend/vueJs/docker/${ENV}/node-cli/Dockerfile frontend/vueJs/docker

frontend-vue-init: frontend-vue-yarn-install frontend-vue-yarn-build

frontend-vue-node-exec:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-vue.yml -p ${FRONTEND_VUE_COMPOSE_PROJECT_NAME} run --rm $(FRONTEND_VUE_NODE_CLI) $(cmd)

frontend-vue-yarn-install:
	$(MAKE) frontend-vue-node-exec cmd="yarn install --no-bin-links"
	$(MAKE) -s frontend-vue-chown

frontend-vue-yarn-remove:
	$(MAKE) frontend-vue-node-exec cmd="yarn remove $(package)"
	$(MAKE) -s frontend-vue-chown

frontend-vue-yarn-build:
	$(MAKE) frontend-vue-node-exec cmd="yarn run build"
	@$(MAKE) -s frontend-vue-chown

frontend-vue-yarn-watch:
	$(MAKE) frontend-vue-node-exec cmd="yarn run watch"
	@$(MAKE) -s frontend-vue-chown

frontend-vue-chown:
	$(MAKE) frontend-vue-node-exec cmd="chown -R 1000:1000 ./"

frontend-vue-node-shell:
	$(MAKE) frontend-vue-node-exec cmd="sh"

# ============================== END FRONTEND VUE =================================== #

# ============================== BEGIN FRONTEND NUXT =================================== #

frontend-nuxt-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-nuxt.yml -p ${FRONTEND_NUXT_COMPOSE_PROJECT_NAME} ps

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
		-f frontend/nuxtJs/docker/${ENV}/nginx/Dockerfile frontend/nuxtJs/docker

docker-build-frontend-nuxt-node-cli:
	@docker build -t ${REGISTRY}/todo-skill-up-frontend-nuxt-node-cli:${IMAGE_TAG} \
		-f frontend/nuxtJs/docker/${ENV}/node-cli/Dockerfile frontend/nuxtJs/docker

frontend-nuxt-init: frontend-nuxt-yarn-install frontend-nuxt-yarn-build

frontend-nuxt-node-exec:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-nuxt.yml -p ${FRONTEND_NUXT_COMPOSE_PROJECT_NAME} run --rm $(FRONTEND_NUXT_NODE_CLI) $(cmd)

frontend-nuxt-yarn-install:
	$(MAKE) frontend-nuxt-node-exec cmd="yarn install --no-bin-links"
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
	$(MAKE) api-node-exec cmd="yarn add $(package)"
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

# ============================== BEGIN WS NodeJs =================================== #

ws-node-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-node.yml -p ${WS_NODE_COMPOSE_PROJECT_NAME} ps

ws-node-docker-logs:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-node.yml -p ${WS_NODE_COMPOSE_PROJECT_NAME} logs -f

up-ws-node:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-node.yml -p ${WS_NODE_COMPOSE_PROJECT_NAME} up -d --remove-orphans

down-ws-node:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-node.yml -p ${WS_NODE_COMPOSE_PROJECT_NAME} down --remove-orphans

restart-ws-node: down-ws-node \
	up-ws-node

docker-build-ws-node: docker-build-ws-node-app \
	docker-build-ws-node-cli

docker-build-ws-node-app:
	@docker build -t ${REGISTRY}/todo-skill-up-ws-node:${IMAGE_TAG} \
		-f websocket/nodeJs/docker/${ENV}/node-app/Dockerfile websocket/nodeJs/docker

docker-build-ws-node-cli:
	@docker build -t ${REGISTRY}/todo-skill-up-ws-node-cli:${IMAGE_TAG} \
		-f websocket/nodeJs/docker/${ENV}/node-cli/Dockerfile websocket/nodeJs/docker

ws-node-init: ws-node-yarn-install ws-node-yarn-build

ws-node-exec:
	@docker-compose --env-file ./docker.env -f docker-compose-ws-node.yml -p ${WS_NODE_COMPOSE_PROJECT_NAME} run --rm $(WS_NODE_CLI) $(cmd)

ws-node-yarn-install:
	$(MAKE) ws-node-exec cmd="yarn install --no-bin-links"
	$(MAKE) -s ws-node-chown

ws-node-yarn-add:
	$(MAKE) ws-node-exec cmd="yarn add $(package)"
	$(MAKE) -s ws-node-chown

ws-node-yarn-remove:
	$(MAKE) ws-node-exec cmd="yarn remove $(package)"
	$(MAKE) -s ws-node-chown

ws-node-yarn-build:
	$(MAKE) ws-node-exec cmd="yarn run build"
	@$(MAKE) -s ws-node-chown

ws-node-chown:
	$(MAKE) ws-node-exec cmd="chown -R 1000:1000 ./"

ws-node-shell:
	$(MAKE) ws-node-exec cmd="sh"

ws-node-app-cli:
	$(MAKE) ws-node-exec cmd="yarn run console $(cmd)"

rebuild-ws-node-app: down-ws-node \
	ws-node-yarn-build \
	up-ws-node

# ============================== END WS NodeJs =================================== #