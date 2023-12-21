import {
  CategoryCard,
  EventCard,
  EventSearchBar,
  HighlightEventCard
} from '@/components/event';
import { MainLayout } from '@/components/layout';
import { Button, Skeleton } from '@/components/ui';
import { useCategories, useEvents } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import Image from 'next/image';
import Link from 'next/link';

const Home: NextPageWithLayout = () => {
  const { events, isLoading: eventLoading } = useEvents();
  const { categories, isLoading: categoryLoading } = useCategories();

  return (
    <>
      {/* HEADER */}
      <section className="px-[200px] py-36 w-full relative flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-primary-500 opacity-20"></div>
        <Image
          src="/images/main-poster.png"
          alt="main-poster"
          fill
          style={{ objectFit: 'cover' }}
        />
        <h1 className="text-white text-[68px] font-bold leading-[88px] mx-auto text-center z-20 ">
          Lập <span className="text-primary">những kế hoạch</span> tuyệt vời
          nhất cho chính mình
        </h1>
        {/* SEARCH */}
        <div className="absolute bottom-0 z-30 px-[293px] w-full translate-y-1/2 cursor-pointer">
          <Link href={'/event/search'}>
            <EventSearchBar />
          </Link>
        </div>
      </section>

      {/* NEWEST EVENTS */}
      <section className="mt-28 mx-[132px] mb-[100px]">
        <div className="flex items-center justify-between mb-[52px]">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Sự kiện <span className="text-primary-500">mới nhất</span>
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

        <div className="grid grid-cols-3 gap-8">
          {eventLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            events
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              ?.slice(0, 3)
              .map(event => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="my-[100px] mx-[132px]">
        <h2 className="mb-[34px] text-[32px] font-bold leading-[48px]">
          Khám phá theo <span className="text-primary-500">thể loại</span>
        </h2>

        <div className="flex justify-center gap-7">
          {categoryLoading ? (
            <>
              <Skeleton className="w-[211px] h-[154px]" />
              <Skeleton className="w-[211px] h-[154px]" />
              <Skeleton className="w-[211px] h-[154px]" />
              <Skeleton className="w-[211px] h-[154px]" />
              <Skeleton className="w-[211px] h-[154px]" />
            </>
          ) : (
            categories &&
            categories.length > 0 &&
            categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-14 px-[132px] bg-neutral-100">
        <div className="flex items-center justify-between mb-[52px]">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Sắp diễn ra <span className="text-primary-500">trong 24h</span>
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

        <div className="grid grid-cols-2 gap-6">
          {eventLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            events &&
            events.length > 0 &&
            events
              .filter(event => {
                const currentDate = new Date();
                const twentyFourHoursLater = new Date(
                  currentDate.getTime() + 24 * 60 * 60 * 1000
                );
                return (
                  new Date(event.eventDate) > currentDate &&
                  new Date(event.eventDate) <= twentyFourHoursLater
                );
              })
              ?.slice(0, 2)
              .map(event => (
                <EventCard key={event.id} event={event} size="large" />
              ))
          )}
        </div>
      </section>

      {/* HIGHLIGHT EVENTS */}
      <section className="my-[100px] mx-[132px]">
        <div className="flex items-center justify-between mb-[52px]">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Điểm nhấn <span className="text-primary-500">trong tuần</span>
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

        <div className="w-full p-[60px] bg-slate-600 grid grid-cols-2 gap-[60px]">
          {eventLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            events &&
            events.length > 0 && <HighlightEventCard event={events[0]} />
          )}
        </div>
      </section>

      {/* MORE EVENTS */}
      <section className="my-[100px] mx-[132px]">
        <div className="flex items-center justify-between mb-[52px]">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Nhiều sự kiện hơn
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

        <div className="grid grid-cols-3 gap-8">
          {eventLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            events &&
            events.length > 0 &&
            events
              ?.slice(0, 3)
              .map(event => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </section>
    </>
  );
};

Home.Layout = MainLayout;

export default Home;
