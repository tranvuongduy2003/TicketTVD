'use client';

import { Event } from '@/models';
import { formatDate } from '@/utils';
import Link from 'next/link';
import { LuCalendar, LuMapPin } from 'react-icons/lu';
import { Button } from '../ui';
import { useRouter } from 'next/router';

export interface HighlightEventCardProps {
  event: Event;
}

export function HighlightEventCard({ event }: HighlightEventCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/event/${event.id}`)}
      className="px-8 py-11 bg-[#FFFFFFF2] rounded-m"
    >
      {event.ticketPrice && event.ticketPrice > 0 ? (
        <span className="text-primary-500 text-sm">
          Từ {event.ticketPrice.toLocaleString()} VNĐ
        </span>
      ) : (
        <span className="text-secondary-500 text-sm font-bold">Miễn phí</span>
      )}
      <h3 className="text-xl font-bold mt-[14px]">{event.name}</h3>
      <p className="mb-2 flex items-center gap-2 text-primary-500 font-bold text-sm my-2">
        <LuCalendar /> {formatDate(new Date(event.startTime))}
      </p>
      <p className="flex items-center gap-2 text-neutral-500 text-sm mb-[18px]">
        <LuMapPin /> {event.location}
      </p>
      <Button type="button" className="text-white">
        Mua vé
      </Button>
    </div>
  );
}
