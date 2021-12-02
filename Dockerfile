# Install dependencies only when needed
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /backend 

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 100000

COPY . .

ENV PORT 6006
EXPOSE 6006

ENTRYPOINT ["yarn"]

CMD ["dev"]