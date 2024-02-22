import { eventApi } from '@/apis';
import { DetailItem } from '@/components/event';
import { MainLayout } from '@/components/layout';
import { Button, Loading, useToast } from '@/components/ui';
import { MILLISECOND_PER_SECOND } from '@/constants';
import { useEvent } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { cn } from '@/types';
import {
  calculateTime,
  formatDateToLocaleDate,
  formatDateToTime
} from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuClock,
  LuMapPin,
  LuTicket
} from 'react-icons/lu';
import { MdOutlineDiscount } from 'react-icons/md';

const EventDetailPage: NextPageWithLayout = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { eventId } = router.query;

  const { event, isLoading } = useEvent(eventId as string);

  const [isShowMoreDesc, setIsShowMoreDesc] = useState<boolean>(false);
  // const [isFavourite, setIsFavourite] = useState<boolean>(false);

  async function handleIncreaseFavourire() {
    try {
      await eventApi.increaseFavourite(eventId as string);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Đã xảy ra lỗi',
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  async function handleDecreaseFavourire() {
    try {
      await eventApi.decreaseFavourite(eventId as string);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Đã xảy ra lỗi',
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  return !eventId || isLoading || !event ? (
    <Loading />
  ) : (
    <div>
      {/* HEADER */}
      <div className="w-full py-[120px] px-[132px] relative">
        <div
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-700 absolute z-50 top-9 left-8 bg-white hover:bg-slate-100 cursor-pointer"
        >
          <LuArrowLeft />
        </div>
        <Image
          fill
          src={event?.coverImage ?? ''}
          alt="event-poster"
          objectFit="cover"
        />
        <div className="bg-white opacity-95 rounded-m px-28 py-9 flex flex-col items-center">
          <span className="text-center mb-4 text-sm font-bold">
            {event?.startTime && new Date(event?.startTime).getDate()} tháng{' '}
            {event?.startTime && new Date(event?.startTime).getMonth()}
          </span>
          <h2 className="text-center text-[40px] font-bold leading-[56px] text-primary-500 mb-4">
            {event?.name}
          </h2>
          <p className="text-sm text-neutral-550 mb-8">{event?.description}</p>
          {/* <div className="flex items-center justify-center gap-6">
            <Badge
              className="flex gap-2 items-center text-sm text-white shadow-m px-6 h-9 bg-danger-500"
              onClick={handleIncreaseFavourire}
            >
              <FaRegHeart /> {event?.favourite}
            </Badge>
            <Badge className="flex gap-2 items-center text-sm text-white shadow-m px-6 h-9">
              <LuShare2 /> {event?.share}
            </Badge>
          </div> */}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex gap-12 mx-[132px] mt-[77px]">
        {/* LEFT */}
        <div className="flex-1 ">
          <div className="mb-[54px]">
            <h3 className="text-2xl font-bold mb-8">Thời gian và địa điểm</h3>
            <div className="flex items-center w-full gap-[18px]">
              <div className="w-1/2">
                <DetailItem
                  icon={<LuCalendar />}
                  title="Thời gian"
                  description={
                    <div className="flex flex-col">
                      <span>
                        {event?.startTime &&
                          formatDateToLocaleDate(new Date(event?.startTime))}
                      </span>
                      <span>
                        {event?.startTime &&
                          formatDateToTime(new Date(event?.startTime))}
                      </span>
                    </div>
                  }
                />
              </div>
              <div className="w-1/2">
                <DetailItem
                  icon={<LuMapPin />}
                  title="Địa điểm"
                  description={event?.location}
                />
              </div>
            </div>
          </div>
          <div className="mb-[54px]">
            <h3 className="text-2xl font-bold mb-8">Về sự kiện</h3>
            <div className="flex items-center w-full gap-[18px] mb-[30px]">
              <div className="w-1/2">
                <DetailItem
                  icon={<LuClock />}
                  title="Diễn ra trong"
                  description={
                    event?.ticketStartTime &&
                    event?.ticketCloseTime &&
                    calculateTime(
                      event?.ticketStartTime,
                      event?.ticketCloseTime
                    )
                  }
                />
              </div>
              <div className="w-1/2">
                <DetailItem
                  icon={<LuTicket />}
                  title="Vé"
                  description="Email eTicket"
                />
              </div>
            </div>
            <p
              className={cn(
                'text-neutral-550 leading-[26px] mb-3 transition-all',
                isShowMoreDesc ? '' : 'text-ellipsis line-clamp-3'
              )}
            >
              {event?.description}
            </p>
            <span
              className="text-primary-500 cursor-pointer hover:underline hover:underline-offset-2 leading-[26px]"
              onClick={() => setIsShowMoreDesc(!isShowMoreDesc)}
            >
              {isShowMoreDesc ? 'Thu gọn' : 'Đọc thêm'}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-8">
              Album mới nhất của sự kiện
            </h3>

            {event && event.album && event.album.length > 0 && (
              <div className="grid grid-cols-4 grid-rows-2 w-full h-[257px] gap-6">
                {event.album.map((image, index) => (
                  <div
                    key={index}
                    className="first:col-span-2 first:row-span-2 relative overflow-hidden rounded-m"
                  >
                    <Image
                      src={image}
                      fill
                      alt="album-image"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-1/3">
          <div className="p-8 rounded-m bg-neutral-100">
            <div className="bg-white rounded-m shadow-m p-5">
              <h5 className="font-bold text-neutral-650 mb-5">Giá</h5>
              {event && event?.ticketPrice > 0 ? (
                <div className="flex items-center justify-between">
                  <span>
                    <span className="font-bold">
                      {event?.ticketPrice.toLocaleString()} VNĐ
                    </span>{' '}
                    / Vé
                  </span>
                  {event.promotionPlan > 0 && (
                    <div className="p-[6px] flex items-center text-white gap-1 text-xs bg-secondary-500 rounded-full">
                      <MdOutlineDiscount />
                      {event.promotionPlan}% GIẢM
                    </div>
                  )}
                </div>
              ) : (
                <span className="p-[6px] px-3 inline-flex items-center text-white bg-secondary-500 rounded-full font-bold">
                  Miễn phí
                </span>
              )}
            </div>
            {event.ticketSoldQuantity < event.ticketQuantity ? (
              <Link href={`/event/${eventId}/checkout`}>
                <Button type="button" className="text-white w-full mt-7">
                  Mua vé
                </Button>
              </Link>
            ) : (
              <div className="text-danger-500 font-bold w-full mt-7 border-2 rounded-md border-solid border-danger-500 text-center h-10 px-4 py-2">
                Hết vé
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-[132px] py-12 mt-[88px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Sự kiện <span className="text-primary-500">tương tự</span>
          </h2>
          <Link href={'/event/search'}>
            <Button
              type="button"
              className="bg-primary-100 text-primary-500 hover:bg-primary-200"
            >
              Xem thêm
            </Button>
          </Link>
        </div>

        {/* <div className="grid grid-cols-2 gap-6">
          {eventLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            events &&
            events.length > 0 &&
            events
              ?.slice(0, 2)
              .map(event => (
                <EventCard key={event.id} event={event} size="large" />
              ))
          )}
        </div> */}
      </div>
    </div>
  );
};

EventDetailPage.Layout = MainLayout;

export default EventDetailPage;
