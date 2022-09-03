FROM node:16.15-alpine

WORKDIR /nestjs

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
RUN yarn global add @nestjs/cli

COPY . .

EXPOSE 6006


CMD ["yarn", "start"] 