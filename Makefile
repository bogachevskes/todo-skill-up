include .env

install:
	@$(MAKE) -s down
	@$(MAKE) -s docker-build

up: docker-up

docker-up:
	@docker-compose -p ${PROJECT} up -d

down: docker-down

docker-down:
	@docker-compose -p ${PROJECT} down --remove-orphans

restart:
	@$(MAKE) -s down
	@$(MAKE) -s up
ps:
	@docker-compose -p ${PROJECT} ps
docker-build: \
	docker-build-frontend \
	docker-build-api \
	docker-build-api-cli \
	docker-build-ws

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

api-node-exec:
	@docker-compose -p ${PROJECT} run --rm api-cli $(cmd)
