import { Next } from 'koa';
import { ExtendedContext } from '../../types/koa';

export default async (ctx: ExtendedContext, next: Next) => {
  const { transactionId } = ctx.state;
  ctx.json({
    body: {
      transactionId,
      message: 'Hello world!',
      host: ctx.request.host,
    },
  });
  await next();
};
