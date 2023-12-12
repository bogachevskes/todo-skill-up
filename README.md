# TODO List

Приложение для управления задачами

## Документация по проекту

- swagger - используется Swagger-ui. Открыть по ссылке /swagger-ui

## Сервисы приложения

- api/nodeJs - нативная реализация API приложения на [Node.js](https://nodejs.org) + [TypeScript](https://www.typescriptlang.org)
- frontend/nuxt - реализация клиентской части на [Nuxt.js](https://nuxt.com)
- migrations - реализация миграций на [cakephp/phinx](https://github.com/cakephp/phinx)
- websocket/nestJs - реализация вебсокетов на [NestJs](https://nestjs.com)

## Требования к окружению

- Docker 20.x.x
- Docker Compose 1.29.x

## Установка приложения для исполнения в продуктивном режиме

1. скопировать .env.dist в .env
1. настроить переменные окружения
1. выполнить команду make install, дождаться завершения установки

> Если проект инициализируется впервые - выполнить команду make seed

## Установка приложения для исполнения в режиме разработки

1. выполнить пункты раздела `Установка приложения для исполнения в продуктивном режиме`
1. выполнить команду frontend-publish-dev-dependencies
1. выполнить команду api-publish-dev-dependencies
1. выполнить команду ws-publish-dev-dependencies
1. выполнить команду migrator-publish-dev-dependencies
1. в файле .env изменить значение переменной окружения `ENV=development`
1. перезапустить сервисы командой `make restart`
1. открыть приложение в браузере по адресу `http://localhost:{NGINX_PORT}`

## Основные `make`-команды

- `make install` - выполнить установку приложения
- `make up` - запуск контейнеров приложения
- `make down` - остановка контейнеров приложения
- `make restart` - перезапуск контейнеров
- `make ps` - статус контейнеров приложения
- `make logs` - логи контейнеров приложения
- `make migrate` - выполнить миграции
- `make seed` - заполнить таблицу начальными данными
- `make create-migration` - создать миграцию
- `make create-seed` - создать процедуру заполнения БД начальными данными
- `frontend-publish-dev-dependencies` - опубликовать зависимости приложения frontend для разработки на локальной машине
- `api-publish-dev-dependencies` - опубликовать зависимости приложения API для разработки на локальной машине
- `ws-publish-dev-dependencies` - опубликовать зависимости приложения вебсокет сервера для разработки на локальной машине
- `migrator-publish-dev-dependencies` - опубликовать зависимости приложения миграций для разработки на локальной машине

## Переменные окружения


```dotenv
# Режим окружения production/development
ENV=production

# Имя проекта для docker compose
DOCKER_PROJECT=todo-skill-up
# Хранилище контейнеров
DOCKER_REGISTRY=localhost
# Версия контейнеров
DOCKER_IMAGE_VERSION=latest

# Имя образа контейнера вспомогательных инструментов
DOCKER_COMMON_TOOLS_IMAGE_NAME=todo-skill-up-common-tools
# Имя образа контейнера API приложения
DOCKER_API_IMAGE_NAME=todo-skill-up-api-node
# Имя образа контейнера клиенсткой части приложения
DOCKER_FRONTEND_IMAGE_NAME=todo-skill-up-nuxt
# Имя образа контейнера приложения веб-сокетов
DOCKER_WS_IMAGE_NAME=todo-skill-up-ws-nest
# Имя образа контейнера приложения миграций
DOCKER_MIGRATIONS_IMAGE_NAME=todo-skill-up-migrations
# Имя образа контейнера веб-сервера
DOCKER_NGINX_IMAGE_NAME=todo-skill-up-nginx
# Имя образа контейнера Swagger UI
DOCKER_SWAGGER_IMAGE_NAME=todo-skill-up-swagger

# Порт веб-сервера
NGINX_PORT=8085
# URL API приложения
APP_BASE_URL=http://localhost:${NGINX_PORT}
# URL приложения веб-сокетов
WS_APP_URL=ws://localhost:${NGINX_PORT}

# Временная зона
TZ=Europe/Moscow

# Секретное слово подписи JWT-токена
JWT_SECRET_WORD=secret
# Время жизни JWT-токена
JWT_EXPIRATION_TIME=5e5

# Хост базы данных внутренней сети контейнеров
DB_HOST=mariadb
# Имя базы данных
DB_NAME=todo_skill_up
# Пароль суперпользователя базы данных
DB_ROOT_PASSWORD=secret
# Порт базы данных внутренней сети контейнеров
DB_PORT=3306
# Порт базы данных для обращений с хост-машины
DB_OUTER_PORT=33061
# Пользователь базы данных
DB_USER=todo_skill_up
# Пароль пользователя базы данных
DB_PASSWORD=secret
# Логирование запросов выполняемых пакетом TypeORM
TYPEORM_DB_LOGGING=false

# Хост Redis внутренней сети контейнеров
REDIS_HOST=redis
# Порт Redis внутренней сети контейнеров
REDIS_PORT=6379
# Порт Redis для обращений с хост-машины
REDIS_OUTER_PORT=6379
```