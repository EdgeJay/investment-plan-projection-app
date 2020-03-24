# Investment Plan Projection App

An investment plan projection SPA built in React.

Frontend app bootstrapped via CRA. Additional api support provided by Koa.js app. Client and server apps are accessible via Nginx and deployable via Docker.

A working version of the app can also be viewed at http://134.209.40.92

## Getting started

### Pre-requisites

- Node.js v12.16.0+; Strongly recommended to install via `nvm`.
- Yarn
- Docker

### Install dependencies

1. `touch .env && echo "NODE_PORT=4000" > ./.env`
2. `yarn install`

### Without Docker

1. `cd packages/server`
2. `yarn run dev`
3. `cd packages/client`
4. `yarn run start`

### With Docker

1. `yarn run docker:build-all`
2. `yarn run docker:deploy`

Refer to "Getting started" sections README files in each package for more details.

## Available scripts

### yarn run docker:build-all

Re-build all images via Docker compose

### yarn run docker:deploy

Runs all containers via Docker compose
