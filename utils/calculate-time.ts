import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';

export function calculateTime(startTime: Date, endTime: Date) {
  const distance = formatDistance(new Date(startTime), new Date(endTime), {
    locale: vi
  });
  return distance;
}
