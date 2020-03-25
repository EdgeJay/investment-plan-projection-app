import fetchPonyfill from 'fetch-ponyfill';
import { convertToInt } from './numbers';

const { fetch, Request } = fetchPonyfill();

export interface ProjectionRow {
  sequence: number;
  yearMonth: string;
  totalDeposit: number;
  expectedAmounts: {
    '10': number;
    '50': number;
    '75': number;
    benchmark: number;
  };
  chanceOfUnderPerformingBenchmark: number;
}

export async function fetchProjection({
  initialInvestment,
  monthlyInvestment,
}: {
  initialInvestment: number;
  monthlyInvestment: number;
}): Promise<ProjectionRow[]> {
  let result: ProjectionRow[] = [];

  if (!Number.isNaN(initialInvestment) && !Number.isNaN(monthlyInvestment)) {
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

    if (Array.isArray(dataSet)) {
      result = dataSet.map(row => ({
        sequence: convertToInt(row.sequence),
        yearMonth: row.yearMonth,
        totalDeposit: convertToInt(row.totalDeposit),
        expectedAmounts: {
          '10': convertToInt(row.expectedAmounts['10']),
          '50': convertToInt(row.expectedAmounts['50']),
          '75': convertToInt(row.expectedAmounts['75']),
          benchmark: convertToInt(row.expectedAmounts.benchmark),
        },
        chanceOfUnderPerformingBenchmark: convertToInt(row.chanceOfUnderPerformingBenchmark),
      }));
    }
  }

  return result;
}
