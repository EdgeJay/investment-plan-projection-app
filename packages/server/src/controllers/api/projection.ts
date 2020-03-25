import { Next } from 'koa';
import { api, numbers } from '@ipp/common';
import etag from 'etag';
import { ExtendedContext } from '../../types/koa';

export default async (ctx: ExtendedContext, next: Next): Promise<void> => {
  if (ctx.request.method === 'POST') {
    const { initialInvestment: initial, monthlyInvestment: monthly } = ctx.request.body || {};
    const initialInvestment = numbers.convertToInt(initial || '');
    const monthlyInvestment = numbers.convertToInt(monthly || '');

    const dataSet = await api.fetchProjection({
      initialInvestment,
      monthlyInvestment,
    });

    const eTagValue = etag(JSON.stringify(dataSet));

    ctx.set('ETag', eTagValue);
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    ctx.json({ body: dataSet });
  } else if (ctx.request.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    ctx.set('Access-Control-Request-Method', 'POST');
    ctx.set('Access-Control-Allow-Headers', 'content-type');
  }

  await next();
};
