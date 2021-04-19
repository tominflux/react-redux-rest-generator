FROM node:15-alpine

WORKDIR /usr/src/app

# PREPARE

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./lerna.json ./

COPY ./packages/r3g-example/package.json  ./packages/r3g-example/
COPY ./packages/r3g-example/yarn.lock  ./packages/r3g-example/

COPY ./packages/react-redux-rest-generator/package.json ./packages/react-redux-rest-generator/
COPY ./packages/react-redux-rest-generator/yarn.lock ./packages/react-redux-rest-generator/

RUN npx lerna bootstrap

# BUILD

COPY . .

WORKDIR /usr/src/app/packages/r3g-example

RUN yarn build

# RUN

CMD ["yarn", "dev"]
