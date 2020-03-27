FROM node:12.16.1 as base

WORKDIR /var/www
COPY . .
RUN yarn install

WORKDIR /var/www/packages/server
RUN yarn run build

EXPOSE 4000

CMD ["node", "-r", "esm", "./dist/index.js"]
