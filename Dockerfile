FROM node:15-alpine

WORKDIR /usr/src/app

# PREPARE

# - Common Resources
COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./lerna.json ./

# - App
COPY ./packages/r3g-example/package.json  ./packages/r3g-example/
COPY ./packages/r3g-example/yarn.lock  ./packages/r3g-example/

# - Depenency: R3G
COPY ./packages/react-redux-rest-generator/package.json ./packages/react-redux-rest-generator/
COPY ./packages/react-redux-rest-generator/yarn.lock ./packages/react-redux-rest-generator/

RUN npx lerna bootstrap

# BUILD

COPY . .

WORKDIR /usr/src/app/packages/r3g-example

RUN yarn build

# RUN

CMD ["yarn", "dev"]
