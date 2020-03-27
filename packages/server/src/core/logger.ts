import Koa from 'koa';
import logger from 'koa-pino-logger';
import { ExtendedState, ExtendedContext } from '../types/koa';

export function initLogger(app: Koa<ExtendedState, ExtendedContext>): void {
  app.use(
    logger({
      name: 'tchr',
    })
  );
}
