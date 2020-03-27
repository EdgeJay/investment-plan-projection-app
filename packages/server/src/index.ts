import Koa from 'koa';
import { initDotEnv, getNodePort, getRedisConfig } from './core/env';
import { initLogger } from './core/logger';
import { initRedis } from './core/redis';
import { initRoutes } from './core/routes';
import { ExtendedState, ExtendedContext } from './types/koa';

function start(): void {
  const app = new Koa<ExtendedState, ExtendedContext>();

  // init logging
  initLogger(app);

  // fetch and setup dotenv vars
  const env = initDotEnv();

  if (env) {
    /**
     * env variables are deliberately passed into subsequent function calls
     * to prevent direct references to process.env in functions, which can
     * make testing difficult. It also makes parts of codebase tightly coupled
     * with process.env.
     */

    initRedis(app, getRedisConfig(env));

    initRoutes(app);

    const port = getNodePort(env);
    app.listen(port, (): void => {
      // eslint-disable-next-line
      console.log(`Server started listening at port ${port}`);
      // eslint-disable-next-line
      console.log(`Docker environment: ${!!process.env.DOCKER_ENV}`);
      // eslint-disable-next-line
      console.log(`Redis host: ${process.env.REDIS_HOST}`);
    });
  } else {
    throw new Error('Missing dotenv configuration');
  }
}

start();
