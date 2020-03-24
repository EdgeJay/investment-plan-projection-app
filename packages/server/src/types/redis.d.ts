import { RedisClient } from 'redis';

export interface AsyncRedisClient extends RedisClient {
  getAsync(key: string): Promise<boolean>;
  setAsync(key: string, value: string): Promise<boolean>;
}
