import { convertToInt } from './numbers';

export function convertToDate(dateStr: string): Date | null {
  if (dateStr && dateStr.includes('-')) {
    const parts = dateStr.split('-');
    return new Date(convertToInt(parts[0]), convertToInt(parts[1]) - 1);
  }
  return null;
}
