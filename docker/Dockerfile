# FRONTEND
FROM node:14.19-alpine as frontend

RUN mkdir -p /app
WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY ./frontend/nuxtJs/ /app

RUN yarn install
RUN yarn run build

EXPOSE 80

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=80

CMD [ "yarn", "start" ]

# API CLI
FROM node:14.19-alpine as api-cli

RUN mkdir -p /app
WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY ./api/nodeJs/ /app/

RUN yarn install
RUN yarn run build

# API
FROM node:14.19-alpine as api

RUN mkdir -p /app
WORKDIR /app

COPY --from=api-cli /app /app/

EXPOSE 80

CMD [ "yarn", "start" ]

# WS
FROM node:14.19-alpine as ws

RUN mkdir -p /app
WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY ./websocket/nestJs/ /app/

RUN yarn install
RUN yarn run build

EXPOSE 80

CMD [ "node", "dist/main.js" ]

# PHP CLI
FROM php:8.2-cli-alpine3.17 as migrations

COPY ./docker/php/cli/conf.d/* $PHP_INI_DIR/conf.d
COPY ./docker/php/php.ini $PHP_INI_DIR/php.ini

COPY ./docker/common/wait-for /usr/local/bin/wait-for
RUN chmod +x /usr/local/bin/wait-for

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN install-php-extensions @composer-2 opcache pdo_mysql

ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_MEMORY_LIMIT -1

COPY ./migrations /app

RUN apk --no-cache add bash

WORKDIR /app

RUN rm -rf /app/vendor \
    && composer --no-ansi --no-interaction install --no-progress