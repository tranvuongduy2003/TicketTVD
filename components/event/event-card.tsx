'use client';

import { Event } from '@/models';
import { cn } from '@/types';
import { formatDate } from '@/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LuCalendar, LuMapPin } from 'react-icons/lu';

export interface EventCardProps {
  size?: 'small' | 'large';
  mode?: 'dark' | 'light';
  event: Event;
}

export function EventCard({
  size = 'small',
  mode = 'light',
  event
}: EventCardProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'cursor-pointer rounded-m overflow-hidden hover:scale-105 transition-all',
        mode === 'light'
          ? 'bg-white border-solid border border-neutral-300'
          : mode === 'dark'
          ? 'bg-neutral-700'
          : ''
      )}
      onClick={() => router.push(`/event/${event.id}`)}
    >
      <div
        className={cn(
          'w-full overflow-hidden relative',
          size === 'small' ? 'h-[207px]' : size === 'large' ? 'h-[229px]' : ''
        )}
      >
        <Image
          src={event?.coverImage}
          alt="event-card-cover-image"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="px-6 py-7">
        <div className="flex justify-between items-center mb-[14px]">
          <h3 className={cn('font-bold', mode === 'dark' && 'text-white')}>
            {event?.name}
          </h3>
          {event && event.ticketPrice && event.ticketPrice > 0 ? (
            <span className="text-primary-500 text-sm">
              Từ {event.ticketPrice.toLocaleString()} VNĐ
            </span>
          ) : (
            <span className="text-secondary-500 text-sm font-bold">
              Miễn phí
            </span>
          )}
        </div>
        <p className="mb-2 flex items-center gap-2 text-primary-500 font-bold text-sm">
          <LuCalendar />{' '}
          {event && event.eventDate && formatDate(new Date(event.eventDate))}
        </p>
        <p className="flex items-center gap-2 text-neutral-500 text-sm">
          <LuMapPin /> {event?.location}
        </p>
      </div>
    </div>
  );
}
