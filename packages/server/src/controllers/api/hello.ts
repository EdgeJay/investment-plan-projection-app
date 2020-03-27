import { Next } from 'koa';
import { ExtendedContext } from '../../types/koa';

export default async (ctx: ExtendedContext, next: Next): Promise<void> => {
  const { transactionId } = ctx.state;

  // test redis
  const result = await ctx.state.redis.setAsync('ipp:last_transaction_id', transactionId);
  ctx.log.info(`Redis key added: ${result}`);

  ctx.json({
    body: {
      transactionId,
      message: 'Hello world!',
      host: ctx.request.host,
    },
  });
  await next();
};
