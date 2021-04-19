FROM node:15-alpine

# BUILD LIB

WORKDIR /usr/src/lib
COPY ./lib/package*.json ./
COPY ./lib/yarn.lock ./

RUN yarn install

COPY ./lib .

RUN yarn build

RUN yarn link


# BUILD APP

WORKDIR /usr/src/app
COPY ./example/package*.json ./
COPY ./example/yarn.lock ./

RUN yarn install

COPY ./example .

RUN yarn link react-redux-rest-generator
RUN yarn install

RUN yarn build

CMD ["yarn", "dev"]