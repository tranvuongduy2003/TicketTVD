'use client';

import { Event } from '@/models';
import { formatDate } from '@/utils';
import Image from 'next/image';
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
        <div className="w-1/2 h-full overflow-hidden relative">
          <Image
            src={event?.coverImage || ''}
            alt="event-card-cover-image"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: '230px', objectFit: 'cover' }}
          />
        </div>
        <div className=" w-1/2 mx-6 px-4 my-11 py-3 rounded-m bg-white">
          {event && event.ticketPrice && event.ticketPrice > 0 ? (
            <span className="text-primary-500 text-sm">
              Từ {event.ticketPrice.toLocaleString()} VNĐ
            </span>
          ) : (
            <span className="text-secondary-500 text-sm font-bold">
              Miễn phí
            </span>
          )}
          <h3 className="font-bold my-3">{event.name}</h3>
          <p className="mb-2 flex items-center gap-2 text-primary-500 font-bold text-sm">
            <LuCalendar />{' '}
            {event && event.startTime && formatDate(new Date(event.startTime))}
          </p>
          <p className="flex items-center gap-2 text-neutral-500 text-sm">
            <LuMapPin /> {event.location}
          </p>
        </div>
      </div>
    </Link>
  );
}
