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

## Запуск приложения через Docker Compose

1. скопировать .env.dist в .env
2. настроить переменные окружения
3. выполнить команду make install, дождаться завершения установки
4. выполнить make seed (если команда не была выполнена ранее)
5. открыть приложение в браузере по адресу `http://localhost:{APP_WEB_PORT}`

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

## Переменные окружения

| Параметр               | Описание                                                   | По умолчанию                                |
|------------------------|------------------------------------------------------------|---------------------------------------------|
| PROJECT                | имя проекта, используется как неймспейс докер-образов      | todo-skill-up-api-node                      |
| NODEJS_API_IMAGE_NAME  | имя образа API на NodeJs                                   | todo-skill-up-api-node                      |
| NODEJS_CLI_IMAGE_NAME  | имя образа CLI на NodeJs                                   | todo-skill-up-api-node-cli                  |
| NODEJS_APP_PATH        | расположение исходных файлов для реализации на NodeJs      | ./api/nodeJs                                |
| NUXT_IMAGE_NAME        | имя образа для фронт-части на Nuxt                         | todo-skill-up-nuxt                          |
| NUXT_APP_PATH          | расположение исходных файлов для реализации на Nuxt        | ./frontend/nuxtJs                           |
| NEST_WS_IMAGE_NAME     | имя образа для вебсокетов на NestJs                        | todo-skill-up-ws-nest                       |
| NEST_APP_PATH          | расположение исходных файлов для реализации на NestJs      | ./websocket/nestJs                          |
| PHINX_MIGRATIONS_IMAGE | имя образа для phinx-миграций                              | todo-skill-up-migrations                    |
| PHINX_MIGRATIONS_PATH  | расположение исходных файлов для реализаций phinx-миграций | ./migrations                                |
| API_IMAGE              | имя образа для API                                         | ссылка на переменную NODEJS_API_IMAGE_NAME  |
| API_PATH               | расположение исходных файлов для API                       | ссылка на переменную NODEJS_APP_PATH        |
| API_CLI_IMAGE          | имя образа для CLI API                                     | ссылка на переменную NODEJS_CLI_IMAGE_NAME  |
| FRONTEND_IMAGE         | имя образа для frontend-части                              | ссылка на переменную NUXT_IMAGE_NAME        |
| FRONTEND_PATH          | расположение исходных файлов для frontend-части            | ссылка на переменную NUXT_APP_PATH          |
| WS_IMAGE               | имя образа для вебсокетов                                  | ссылка на переменную NEST_WS_IMAGE_NAME     |
| WS_PATH                | расположение исходных файлов для вебсокетов                | ссылка на переменную NEST_APP_PATH          |
| MIGRATIONS_IMAGE       | имя образа для миграций                                    | ссылка на переменную PHINX_MIGRATIONS_IMAGE |
| MIGRATIONS_APP_PATH    | расположение исходных файлов для миграций                  | ссылка на переменную PHINX_MIGRATIONS_PATH  |
| NGINX_PORT             | порт веб-сервера                                           | 8080                                        |
| FRONTEND_PORT          | порт для frontend-части                                    | 8081                                        |
| API_PORT               | порт для api                                               | 8082                                        |
| API_URL                | url для api                                                | http://localhost:${API_PORT}                |
| WS_PORT                | порт для вебсокетов                                        | 8888                                        |
| WS_URL                 | url для вебсокетов                                         | ws://localhost:${WS_PORT}                   |
| SWAGGER_PORT           | порт для swagger                                           | 8085                                        |
| ENV                    | окружение - production, development и т.д.                 | development                                 |
| REGISTRY               | регистр докер-образов                                      | localhost                                   |
| IMAGE_TAG              | тэг для образов по умолчанию                               | latest                                      |
| MYSQL_SOURCE_PATH      | путь локальной файловой системы для хранения файлов БД     | ~/ecosystem/lib_mysql/todo_skill_up/        |
| DB_HOST                | хост для БД                                                | mariadb                                     |
| DB_NAME                | имя БД                                                     | todo_skill_up                               |
| DB_ROOT_PASSWORD       | пользователь для root-пользователя БД                      | secret                                      |
| DB_PORT                | порт для БД                                                | 3306                                        |
| DB_USER                | имя пользователя для БД                                    | todo_skill_up                               |
| DB_PASSWORD            | пароль для БД                                              | secret                                      |
| TYPEORM_DB_LOGGING     | флаг включения отладки запросов TypeORM                    | false                                       |
| JWT_SECRET_WORD        | значение для шифрования jwt-токена                         | secret                                      |
| JWT_EXPIRATION_TIME    | время истечения jwt-токена                                 | 5e5                                         |
| REDIS_HOST             | хост для redis                                             | redis                                       |
| REDIS_PORT             | порт для redis                                             | 6379                                        |