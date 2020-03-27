# Investment Plan Projection App

An investment plan projection SPA built in React.

Frontend app bootstrapped via CRA. Additional api support provided by Koa.js app. Client and server apps are accessible via Nginx and deployable via Docker.

A working version of the app can also be viewed at http://134.209.40.92

## Getting started

### Pre-requisites

- Node.js v12.16.0+; Strongly recommended to install via `nvm`.
- Yarn
- Docker

### Setup environment variables

Environment variables used in packages are loaded via `dotenv`.

Add `.env` file with following content to `packages/server`

```
NODE_PORT=4000
REDIS_PORT=6379
```

### Install dependencies

Run the following command at root folder:

`yarn install`

As this repository is managed via Lerna, and uses Yarn workspaces, running `yarn install` will also help to bootstrap all packages stored under `packages/*` and install all required node modules under the root folder.

### Without Docker

IMPORTANT: If you wish to run the apps without Docker, you must have an instance of `redis` running at localhost:6379.

1. `cd packages/server`
2. `yarn run dev`  // server will listen at port 4000
3. `cd packages/client`
4. `yarn run start` // client will run at port 3000

### With Docker

1. `yarn run docker:build`
2. `yarn run docker:deploy`

Refer to "Getting started" sections README files in each package for more details.

## Available scripts

### yarn run docker:build

Re-build all local Docker images via Docker compose

\* Append `-droplet` at end of command to target Digital Ocean droplet instead.

### yarn run docker:deploy

Run all containers via Docker compose

\* Append `-droplet` at end of command to target Digital Ocean droplet instead.

### yarn run docker:dispose

Stop and remove all containers via Docker compose

\* Append `-droplet` at end of command to target Digital Ocean droplet instead.

## 3rd-party libraries

This repo used the following 3rd-party libraries for various tasks:

### [Koa.js](https://koajs.com/)

Backbone of server app. Handles routing, incoming/outgoing requests/responses. Very similar to Express.

### [d3](https://d3js.org/)

For rendering graphs and charts.

### [styled-components](https://styled-components.com/)

Use CSS in code to style React components.

### [dotenv](https://github.com/motdotla/dotenv)

Loads app environment variables from .env files.

### [Pino](https://github.com/pinojs/pino)

Node.js logger.
