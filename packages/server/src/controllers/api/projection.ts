import { Next } from 'koa';
import fetchPonyfill from 'fetch-ponyfill';
import etag from 'etag';
import { ExtendedContext } from '../../types/koa';

const { fetch, Request } = fetchPonyfill();

export default async (ctx: ExtendedContext, next: Next): Promise<void> => {
  const { initialInvestment, monthlyInvestment } = ctx.request.body || {};
  const initInv = parseInt(initialInvestment || '', 10);
  const monthlyInv = parseInt(monthlyInvestment || '', 10);

  if (!Number.isNaN(initInv) && !Number.isNaN(monthlyInv)) {
    const request = new Request(
      'http://www.mocky.io/v2/5e69de892d00007a005f9e29?mocky-delay=2000ms',
      {
        method: 'POST',
        body: JSON.stringify({
          initialInvestment,
          monthlyInvestment,
        }),
      }
    );
    const response = await fetch(request);
    const dataSet = await response.json();
    const eTagValue = etag(JSON.stringify(dataSet));

    ctx.set('ETag', eTagValue);
    ctx.log.info(`ETag generated: ${eTagValue}`);

    ctx.json({ body: dataSet });
  } else {
    ctx.json({ body: [] });
  }

  await next();
};
