include .env

install:
	@$(MAKE) -s down
	@$(MAKE) -s docker-build
	@docker-compose -p ${PROJECT} up -d mariadb
	@$(MAKE) -s migrate
	@$(MAKE) -s up

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

logs:
	@docker-compose logs -f

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

api-cli-exec:
	@$(MAKE) -s wait-db
	@$(MAKE) -s wait-redis
	@docker run --network=todo-skill-up_default \
		-e "DB_HOST=${DB_HOST}" \
		-e "DB_PORT=${DB_PORT}" \
		-e "DB_USER=${DB_USER}" \
		-e "DB_PASSWORD=${DB_PASSWORD}" \
		-e "DB_NAME=${DB_NAME}" \
		-e "DB_LOGGING: ${TYPEORM_DB_LOGGING}" \
		-e "REDIS_HOST: ${REDIS_HOST}" \
		-e "REDIS_PORT: ${REDIS_PORT}" \
		--rm ${DOCKER_REGISTRY}/${DOCKER_API_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} yarn run console $(cmd)

migrator:
	@$(MAKE) -s wait-db
	@docker run --network=todo-skill-up_default \
		-e "DB_HOST=${DB_HOST}" \
		-e "DB_PORT=${DB_PORT}" \
		-e "DB_USER=${DB_USER}" \
		-e "DB_PASSWORD=${DB_PASSWORD}" \
		-e "DB_NAME=${DB_NAME}" \
		--rm ${DOCKER_REGISTRY}/${DOCKER_MIGRATIONS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		vendor/bin/phinx $(cmd)

migrate:
	@$(MAKE) migrator cmd="migrate"

seed:
	@$(MAKE) migrator cmd="seed:run"

create-migration:
	@$(MAKE) migrator cmd="create $(name)"

create-seed:
	@$(MAKE) migrator cmd="seed:create $(name)"

wait-db:
	@docker run --network=todo-skill-up_default \
		--rm ${DOCKER_REGISTRY}/${DOCKER_COMMON_TOOLS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		wait-for mariadb:${DB_PORT} -t 0

wait-redis:
	@docker run --network=todo-skill-up_default \
		--rm ${DOCKER_REGISTRY}/${DOCKER_COMMON_TOOLS_IMAGE_NAME}:${DOCKER_IMAGE_VERSION} \
		wait-for redis:${REDIS_PORT} -t 0