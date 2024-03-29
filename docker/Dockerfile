# COMMON TOOLS
FROM alpine:3.18.4 as common-tools

COPY ./docker/common/wait-for /usr/local/bin/wait-for
RUN apk --no-cache add bash && chmod +x /usr/local/bin/wait-for

# FRONTEND
FROM node:14.19-alpine as frontend

ARG USER='node'
ARG GROUP='node'

USER ${USER}

WORKDIR /app

COPY --chown=${USER}:${GROUP} ./frontend/nuxtJs/ /app

RUN yarn install --no-bin-links

RUN yarn run build

EXPOSE 3000

# API
FROM node:14.19-alpine as api

ARG USER='node'
ARG GROUP='node'

USER ${USER}

WORKDIR /app

COPY --chown=${USER}:${GROUP} ./api/nodeJs/ /app

RUN yarn install --no-bin-links

RUN yarn run build

EXPOSE 8081

# WS
FROM node:14.19-alpine as ws

ARG USER='node'
ARG GROUP='node'

USER ${USER}

WORKDIR /app

COPY --chown=${USER}:${GROUP} ./websocket/nestJs/ /app

RUN yarn install --no-bin-links

RUN yarn run build

EXPOSE 8088

# PHP-Builder
FROM php:8.2-cli-alpine3.17 as php-builder

ARG USER='www-data'
ARG GROUP='www-data'

ENV COMPOSER_MEMORY_LIMIT -1

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN pear update-channels && pecl update-channels \
    && install-php-extensions @composer-2 opcache pdo_mysql

COPY ./docker/php/cli/conf.d/* $PHP_INI_DIR/conf.d
COPY ./docker/php/php.ini-production $PHP_INI_DIR/php.ini

USER ${USER}

WORKDIR /app

COPY --chown=${USER}:${GROUP} ./migrations/composer.json ./migrations/composer.lock /app/

RUN composer --no-ansi --no-interaction install --no-progress

# PHP MIGRATIONS
FROM php:8.2-cli-alpine3.17 as migrations

ARG USER='www-data'
ARG GROUP='www-data'

COPY ./docker/php/cli/conf.d/* $PHP_INI_DIR/conf.d
COPY ./docker/php/php.ini-production $PHP_INI_DIR/php.ini

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN pear update-channels && pecl update-channels \
    && install-php-extensions opcache pdo_mysql

USER ${USER}

COPY --chown=${USER}:${GROUP} ./migrations /app
COPY --from=php-builder --chown=${USER}:${GROUP} /app/vendor /app/vendor

WORKDIR /app

# API TESTS
FROM php:8.2-cli-alpine3.17 as api-tests

ARG USER='www-data'
ARG GROUP='www-data'

COPY ./docker/php/cli/conf.d/* $PHP_INI_DIR/conf.d
COPY ./docker/php/php.ini-production $PHP_INI_DIR/php.ini

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN pear update-channels && pecl update-channels \
    && install-php-extensions @composer-2 opcache pdo_mysql

USER ${USER}

WORKDIR /app

COPY --chown=${USER}:${GROUP} ./tests/composer.json ./tests/composer.lock /app/

RUN composer --no-ansi --no-interaction install --no-progress

# NGINX
FROM nginx:1.20.2-alpine as nginx

COPY ./docker/nginx/templates /etc/nginx/templates

EXPOSE 80

# SWAGGER
FROM swaggerapi/swagger-ui:v5.9.2 as swagger

ENV URL=/swagger-ui/spec.yml

ARG USER='nginx'
ARG GROUP='nginx'

USER ${USER}

COPY --chown=${USER}:${GROUP} ./swagger/* /usr/share/nginx/html
