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