FROM node:15-alpine

WORKDIR /usr/src/lib
RUN yarn link

WORKDIR /usr/src/app
COPY ./example/package*.json ./
COPY ./example/yarn.lock ./

RUN yarn link react-redux-rest-generator

RUN yarn install

COPY . .

RUN yarn run build

CMD ["yarn", "run", "dev"]