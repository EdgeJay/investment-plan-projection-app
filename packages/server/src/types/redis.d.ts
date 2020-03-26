import { RedisClient } from 'redis';

export interface AsyncRedisClient extends RedisClient {
  getAsync(key: string): Promise<string>;
  setAsync(key: string, value: string): Promise<string>;
}
