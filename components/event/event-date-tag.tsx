'use client';

import * as React from 'react';
import { Badge } from '../ui';
import { MILLISECOND_PER_DAY, MILLISECOND_PER_HOUR } from '@/constants';
import { convertToISODate } from '@/utils';

export interface EventDateTagProps {
  eventDate: Date;
}

export function EventDateTag({ eventDate }: EventDateTagProps) {
  const eventISODate = convertToISODate(eventDate);

  const diffDays = Math.round(
    Math.abs(
      (new Date().getTime() - eventISODate.getTime()) / MILLISECOND_PER_DAY
    )
  );

  const daysInMonth = new Date(
    eventISODate.getFullYear(),
    eventISODate.getMonth(),
    0
  ).getDate();

  return eventISODate < new Date() ? (
    <Badge className="bg-danger-100 text-danger-500 hover:bg-danger-100 hover:text-danger-500">
      Đã kết thúc
    </Badge>
  ) : diffDays < 7 ? (
    <Badge className="bg-danger-100 text-danger-500 hover:bg-danger-100 hover:text-danger-500">
      Trong {diffDays} ngày
    </Badge>
  ) : diffDays < daysInMonth ? (
    <Badge className="bg-success-100 text-success-700 hover:bg-success-100 hover:text-success-700">
      {Math.floor(diffDays / 7)} tuần tiếp theo
    </Badge>
  ) : (
    <Badge className="bg-success-100 text-success-700 hover:bg-success-100 hover:text-success-700">
      {Math.floor(diffDays / 12)} tháng tiếp theo
    </Badge>
  );
}
