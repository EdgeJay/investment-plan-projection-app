# ipp-app/server

Server app component of investment-plan-projection-app

## Getting Started

### Install dependencies

1. `touch .env && echo "NODE_PORT=4000" > ./.env`
2. `yarn install`

### Start server in development mode

`yarn run dev`

Open http://localhost:4000/api/hello

### Deploy server as via Docker compose

In this setup, all requests to server app are passed through nginx container "ipp_nginx" first. Nginx container is listening at port 8080.

At root folder

1. `yarn run docker:build`
2. `yarn run docker:deploy`

Open http://localhost:8080/api/hello
