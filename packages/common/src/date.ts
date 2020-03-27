import { convertToInt } from './numbers';

export function isDefined(dateStr: string): boolean {
  return !!dateStr && dateStr.includes('-');
}

export function convertToDate(dateStr: string): Date {
  if (dateStr && dateStr.includes('-')) {
    const parts = dateStr.split('-');
    return new Date(convertToInt(parts[0]), convertToInt(parts[1]) - 1);
  }
  return new Date();
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

export const convertToDateString = (date: Date): string => {
  const [{ value: MMM }, , , , { value: yyyy }, ,] = dateFormatter.formatToParts(date);
  return `${MMM} ${yyyy}`;
};
