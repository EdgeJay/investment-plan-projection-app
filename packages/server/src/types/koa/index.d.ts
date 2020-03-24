import { ParameterizedContext } from 'koa';
import { AsyncRedisClient } from '../redis';

declare module 'koa' {
  interface BodyInput {
    [key: string]: unknown;
  }

  interface JsonInputParams {
    body?: BodyInput | string | unknown[];
    statusCode?: number;
  }

  interface ExtendableContext {
    json: (params: JsonInputParams) => void;
  }

  interface Request {
    body?: {
      initialInvestment?: string;
      monthlyInvestment?: string;
    };
  }
}

export interface ExtendedState {
  transactionId: string;
  redis: AsyncRedisClient;
}

export type ExtendedContext = ParameterizedContext<ExtendedState>;
