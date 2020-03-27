import { Next } from 'koa';
import { api, numbers, ProjectionRow } from '@ipp/common';
import etag from 'etag';
import { ExtendedContext } from '../../types/koa';

function composeCachedItemKey({
  initialInvestment,
  monthlyInvestment,
}: {
  initialInvestment: number;
  monthlyInvestment: number;
}): string {
  return `ipp:${initialInvestment}:${monthlyInvestment}`;
}

export default async (ctx: ExtendedContext, next: Next): Promise<void> => {
  const inDockerEnv = process.env.DOCKER_ENV === 'true';

  if (ctx.request.method === 'POST') {
    const { initialInvestment: initial, monthlyInvestment: monthly } = ctx.request.body || {};
    const initialInvestment = numbers.convertToInt(initial || '');
    const monthlyInvestment = numbers.convertToInt(monthly || '');

    let dataSet: ProjectionRow[] | null = null;
    let eTagValue: string;

    // check if data exists in cache
    const key = composeCachedItemKey({ initialInvestment, monthlyInvestment });
    const cachedData = await ctx.state.redis.getAsync(key);

    try {
      dataSet = JSON.parse(cachedData);
    } catch (err) {
      ctx.log.error('Error encountered: %o', err);
    }

    if (!(dataSet && dataSet.length > 0)) {
      // no cached data found, fetch new data
      dataSet = await api.fetchProjection({
        initialInvestment,
        monthlyInvestment,
      });

      // choose random range of data to return
      const start = Math.floor(Math.random() * (dataSet.length / 2));
      const end = Math.floor(Math.random() * (dataSet.length / 2)) + dataSet.length / 2;
      dataSet = dataSet.slice(start, end);
      const stringifiedResult = JSON.stringify(dataSet);

      // calculate ETag based on response body
      eTagValue = etag(stringifiedResult);
      ctx.log.info('Fetched new data');

      // store into cache
      await ctx.state.redis.setAsync(key, stringifiedResult);
    } else {
      eTagValue = etag(JSON.stringify(cachedData));
      ctx.log.info('Returning cached new data');
    }

    ctx.set('ETag', eTagValue);

    if (!inDockerEnv) {
      ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    }

    ctx.json({ body: dataSet });
  } else if (ctx.request.method === 'OPTIONS' && !inDockerEnv) {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    ctx.set('Access-Control-Request-Method', 'POST');
    ctx.set('Access-Control-Allow-Headers', 'content-type');
  }

  await next();
};
