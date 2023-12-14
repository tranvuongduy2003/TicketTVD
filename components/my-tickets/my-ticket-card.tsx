'use client';

import { MyTicket } from '@/models';
import { formatDate } from '@/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LuCalendar, LuMapPin } from 'react-icons/lu';
import { Separator } from '../ui';

export interface MyTicketCardProps {
  myTicket: MyTicket;
}

export function MyTicketCard({ myTicket }: MyTicketCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => myTicket.id && router.push(`/my-tickets/${myTicket.id}`)}
      className="cursor-pointer rounded-m overflow-hidden hover:scale-105 transition-all bg-white border-solid border border-neutral-200 flex items-center relative"
    >
      <div className="w-1/2 h-full overflow-hidden relative">
        <Image
          src={myTicket?.coverImage || ''}
          alt="myTicket-card-cover-image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: '221px', objectFit: 'cover' }}
        />
      </div>
      <div className=" w-1/2 px-7 py-[22px] flex flex-col justify-center">
        <div>
          <p className="uppercase text-primary-500 font-bold text-xl mb-[3px]">
            {myTicket &&
              myTicket.createdAt &&
              formatDate(new Date(myTicket.createdAt))}
          </p>
          <p className="text-sm font-bold">
            <span className="text-primary-500">{myTicket.quantity} Vé</span>{' '}
            {myTicket.totalPrice && myTicket.totalPrice > 0
              ? `tổng ${myTicket.totalPrice.toLocaleString('vi-VN')} VNĐ`
              : 'Miễn phí'}
          </p>
        </div>
        <Separator className="mb-[14px] mt-5" />
        <div className="text-sm">
          <h3 className="font-bold mb-3">{myTicket.name}</h3>
          <p className="mb-2 flex items-center gap-2 text-neutral-550">
            <LuCalendar className="text-base" />{' '}
            {myTicket &&
              myTicket.eventDate &&
              formatDate(new Date(myTicket.eventDate))}
          </p>
          <p className="flex items-center gap-2 text-neutral-550">
            <LuMapPin className="text-base" /> {myTicket.location}
          </p>
        </div>
      </div>
    </div>
  );
}
