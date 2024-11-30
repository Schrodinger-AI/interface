FROM node:18.18.2

ARG web=/opt/workspace/dapp
ARG BUILD_ENV
ARG NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_TESTNET
ARG NEXT_PUBLIC_TELEGRAM_BOT_ID_TESTNET
ARG NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
ARG NEXT_PUBLIC_TELEGRAM_BOT_ID


ENV NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_TESTNET=${NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_TESTNET}
ENV NEXT_PUBLIC_TELEGRAM_BOT_ID_TESTNET=${NEXT_PUBLIC_TELEGRAM_BOT_ID_TESTNET}
ENV NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=${NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
ENV NEXT_PUBLIC_TELEGRAM_BOT_ID=${NEXT_PUBLIC_TELEGRAM_BOT_ID}

WORKDIR ${web}

COPY . ${web}

RUN yarn && yarn build:${BUILD_ENV}

ENTRYPOINT yarn start

EXPOSE 3000
