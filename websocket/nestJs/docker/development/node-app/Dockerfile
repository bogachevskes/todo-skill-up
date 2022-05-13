FROM node:14.19-alpine

RUN apk update && apk add yarn bash

ENV NODE_ENV=development

WORKDIR /app

CMD [ "yarn", "start:dev" ]