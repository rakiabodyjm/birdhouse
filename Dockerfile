FROM node:16.15-alpine

WORKDIR /nestjs

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
RUN yarn global add @nestjs/cli

COPY . .

EXPOSE 6006

ENV SQL_SERVER_HOST=database

ENV SQL_SERVER_PORT=1433

ENV SQL_SERVER_USERNAME=sa

ENV SQL_SERVER_PASSWORD=Demo_Password

ENV SQL_SERVER_DATABASE=alpha_db

ENV REST_HOST=http://localhost:6006

CMD ["yarn", "start"] 