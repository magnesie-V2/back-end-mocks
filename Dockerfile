FROM node:12-slim

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY ./package*.json ./
USER node
RUN npm i
COPY --chown=node:node ./api-seduce.js .

EXPOSE 7882

ENTRYPOINT node -r esm api-seduce.js