include .env

FRONTEND_VUE_NODE_CLI=frontend-vue-node-cli


docker-build-gateway:
	@docker build -t ${REGISTRY}/todo-skill-up-gateway:${IMAGE_TAG} \
		-f gateway/docker/${ENV}/nginx/Dockerfile gateway/docker

# ============================== BEGIN FRONTEND VUE =================================== #

up-frontend-vue:
	@docker-compose -f docker-compose-frontend-vue.yml up -d

down-frontend-vue:
	@docker-compose -f docker-compose-frontend-vue.yml down --remove-orphans

docker-build-frontend-vue: docker-build-gateway \
	docker-build-frontend-vue-app \
	docker-build-frontend-vue-node-cli

docker-build-frontend-vue-app:
	@docker build -t ${REGISTRY}/todo-skill-up-frontend-vue:${IMAGE_TAG} \
		-f frontend/vueJs/docker/${ENV}/nginx/Dockerfile frontend/vueJs/docker

docker-build-frontend-vue-node-cli:
	@docker build -t ${REGISTRY}/todo-skill-up-frontend-vue-node-cli:${IMAGE_TAG} \
		-f frontend/vueJs/docker/${ENV}/node/Dockerfile frontend/vueJs/docker

frontend-vue-init: frontend-vue-yarn-install frontend-vue-yarn-build

frontend-vue-yarn-install:
	@docker-compose -f docker-compose-frontend-vue.yml run --rm $(FRONTEND_VUE_NODE_CLI) yarn install
	@$(MAKE) -s frontend-vue-chown

frontend-vue-yarn-build:
	@docker-compose -f docker-compose-frontend-vue.yml run --rm $(FRONTEND_VUE_NODE_CLI) yarn run build
	@$(MAKE) -s frontend-vue-chown

frontend-vue-chown:
	@docker-compose -f docker-compose-frontend-vue.yml run --rm $(FRONTEND_VUE_NODE_CLI) chown -R 1000:1000 ./

# ============================== END FRONTEND VUE =================================== #