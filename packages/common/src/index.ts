export * as api from './api';
export * as numbers from './numbers';
export * as date from './date';

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
