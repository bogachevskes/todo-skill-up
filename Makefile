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

frontend-vue-node-exec:
	@docker-compose -f docker-compose-frontend-vue.yml run --rm $(FRONTEND_VUE_NODE_CLI) $(cmd)

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