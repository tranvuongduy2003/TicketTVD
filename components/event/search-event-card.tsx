'use client';

import { Event } from '@/models';
import Link from 'next/link';
import { LuCalendar, LuMapPin } from 'react-icons/lu';
import { MdOutlineDiscount } from 'react-icons/md';

export interface SearchEventCardProps {
  event: Partial<Event>;
}

export function SearchEventCard({ event }: SearchEventCardProps) {
  return (
    <Link href={`/event/${event.id}`}>
      <div
        className="cursor-pointer rounded-m overflow-hidden hover:scale-105 transition-all bg-white border-solid border border-neutral-200 flex items-center relative"
        style={{
          background: event.category?.color
        }}
      >
        {event.ticketPrice &&
        event.ticketPrice > 0 &&
        event.promotionPlan &&
        event.promotionPlan > 0 ? (
          <div className="p-2 flex items-center text-white gap-2 text-xs bg-secondary-500 rounded-bl-[14px] absolute top-0 right-0">
            <MdOutlineDiscount /> {event.promotionPlan}% GIẢM
          </div>
        ) : (
          <></>
        )}
        <h3 className="font-bold my-3">{event.name}</h3>
        <p className="mb-2 flex items-center gap-2 text-primary-500 font-bold text-sm">
          <LuCalendar />{' '}
          {/* {event && event.startTime && formatDate(event.startTime)} */}
        </p>
        <p className="flex items-center gap-2 text-neutral-500 text-sm">
          <LuMapPin /> {event.location}
        </p>
      </div>
    </Link>
  );
}
