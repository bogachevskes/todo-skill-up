FROM node:14.11-alpine

RUN apk update && apk add yarn bash

ENV NODE_ENV=development

WORKDIR /app

CMD [ "yarn", "start" ]