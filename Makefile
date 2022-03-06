include docker.env

FRONTEND_VUE_COMPOSE_PROJECT_NAME=todo-skill-up-frontend-vue
API_NODE_COMPOSE_PROJECT_NAME=todo-skill-up-api-node

FRONTEND_VUE_NODE_CLI=frontend-vue-node-cli
API_NODE_CLI=api-node-cli

# ============================== BEGIN FRONTEND VUE =================================== #

frontend-vue-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-vue.yml -p ${FRONTEND_VUE_COMPOSE_PROJECT_NAME} ps

up-frontend-vue:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-vue.yml -p ${FRONTEND_VUE_COMPOSE_PROJECT_NAME} up -d --remove-orphans

down-frontend-vue:
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-vue.yml -p ${FRONTEND_VUE_COMPOSE_PROJECT_NAME} down --remove-orphans

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
	@docker-compose --env-file ./docker.env -f docker-compose-frontend-vue.yml run --rm $(FRONTEND_VUE_NODE_CLI) -p ${FRONTEND_VUE_COMPOSE_PROJECT_NAME} $(cmd)

frontend-vue-yarn-install:
	$(MAKE) frontend-vue-node-exec cmd="yarn install --no-bin-links"
	$(MAKE) -s frontend-vue-chown

frontend-vue-yarn-build:
	$(MAKE) frontend-vue-node-exec cmd="yarn run build"
	@$(MAKE) -s frontend-vue-chown

frontend-vue-chown:
	$(MAKE) frontend-vue-node-exec cmd="chown -R 1000:1000 ./"

frontend-vue-node-shell:
	$(MAKE) frontend-vue-node-exec cmd="sh"

# ============================== END FRONTEND VUE =================================== #

# ============================== BEGIN API NodeJs =================================== #

api-node-docker-ps:
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml -p ${API_NODE_COMPOSE_PROJECT_NAME} ps

api-node-docker-logs:
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml -p ${API_NODE_COMPOSE_PROJECT_NAME} logs

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
	@docker-compose --env-file ./docker.env -f docker-compose-api-node.yml run --rm $(API_NODE_CLI) -p ${API_NODE_COMPOSE_PROJECT_NAME} $(cmd)

api-node-yarn-install:
	$(MAKE) api-node-exec cmd="yarn install --no-bin-links"
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

# ============================== END API NodeJs =================================== #