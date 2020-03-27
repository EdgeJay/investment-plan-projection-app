FROM node:12.16.1-alpine as client

WORKDIR /var/www
COPY . .
RUN yarn install

WORKDIR /var/www/packages/client
RUN yarn run build

FROM nginx:alpine as release

COPY --from=client /var/www/packages/client/build /var/www/ipp

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf