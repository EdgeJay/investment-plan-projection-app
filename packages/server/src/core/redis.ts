import Koa from 'koa';
import redisCore from 'redis';
import Promise from 'bluebird';
import { ExtendedState, ExtendedContext } from '../types/koa';
import { AsyncRedisClient } from '../types/redis';

Promise.promisifyAll(redisCore);

let redisClient: AsyncRedisClient;

interface RedisConfig {
  host: string;
  port: number;
}

function createRedisClient({ host, port }: RedisConfig): AsyncRedisClient {
  if (!redisClient) {
    redisClient = redisCore.createClient({
      host,
      port,
    }) as AsyncRedisClient;
  }
  return redisClient;
}

export function initRedis(
  app: Koa<ExtendedState, ExtendedContext>,
  redisConfig: RedisConfig
): void {
  const client = createRedisClient(redisConfig);
  app.use(async (ctx, next) => {
    ctx.state.redis = client;
    await next();
  });
}
