import { Next } from 'koa';
import { api, numbers } from '@ipp/common';
import etag from 'etag';
import { ExtendedContext } from '../../types/koa';

export default async (ctx: ExtendedContext, next: Next): Promise<void> => {
  const { initialInvestment: initial, monthlyInvestment: monthly } = ctx.request.body || {};
  const initialInvestment = numbers.convertToInt(initial || '');
  const monthlyInvestment = numbers.convertToInt(monthly || '');

  const dataSet = await api.fetchProjection({
    initialInvestment,
    monthlyInvestment,
  });

  const eTagValue = etag(JSON.stringify(dataSet));

  ctx.set('ETag', eTagValue);
  ctx.json({ body: dataSet });

  await next();
};
