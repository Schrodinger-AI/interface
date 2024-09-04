FROM node:18.18.2

ARG web=/opt/workspace/dapp
ARG BUILD_ENV

WORKDIR ${web}

COPY . ${web}

RUN yarn && yarn build:${BUILD_ENV}

ENTRYPOINT yarn start

EXPOSE 3000
