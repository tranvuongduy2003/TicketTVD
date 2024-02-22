import {
  CategoryCard,
  EventCard,
  EventSearchBar,
  HighlightEventCard
} from '@/components/event';
import { CustomerLayout } from '@/components/layout';
import { Button, Skeleton } from '@/components/ui';
import {
  useCategories,
  useHighlightEvent,
  useHighlightEvents,
  useNewestEvents,
  useRandomEvents,
  useUpcomingEvents
} from '@/hooks';
import { HighlightType, NextPageWithLayout } from '@/models';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ExplorePage: NextPageWithLayout = () => {
  const router = useRouter();

  const { events: newestEvents, isLoading: newestEventsLoading } =
    useNewestEvents();
  const { events: upcomingEvents, isLoading: upcomingEventsLoading } =
    useUpcomingEvents();
  const { event: highlightEvent, isLoading: highlightEventLoading } =
    useHighlightEvent();
  const { events: highlightEvents, isLoading: highlightEventsLoading } =
    useHighlightEvents();
  const { events: randomEvents, isLoading: randomEventsLoading } =
    useRandomEvents();
  const { categories, isLoading: categoryLoading } = useCategories();

  return (
    <>
      {/* HEADER */}
      <section className="px-[132px] pb-[124px] pt-[153px] w-full relative flex flex-col items-center justify-center">
        <Image
          src="/images/explore-poster.png"
          alt="main-poster"
          fill
          style={{ objectFit: 'cover' }}
        />
        <h1 className="text-white text-5xl font-bold leading-[56px] mx-auto text-center z-20">
          Trải nghiệm khó quên tại <br />
          <span className="text-primary">Những sự kiện tuyệt vời</span>
        </h1>

        {/* SEARCH */}
        <div className="px-72 w-full z-20 mt-10 mb-[150px]">
          <EventSearchBar onSearch={() => router.push('/event/search')} />
        </div>

        <h4 className="text-white text-[32px] font-bold leading-[48px] mx-auto text-center z-20 mb-12">
          <span className="text-primary">Top 3</span> sự kiện nổi bật
        </h4>

        <div className="grid grid-cols-3 gap-8 z-20 w-full">
          {highlightEventsLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            highlightEvents &&
            highlightEvents.length > 0 &&
            highlightEvents.map(event => (
              <EventCard key={event.id} event={event} mode="dark" />
            ))
          )}
        </div>
      </section>

      {/* NEWEST EVENTS */}
      <section className="mt-28 mx-[132px] mb-[100px]">
        <div className="flex items-center justify-between mb-[52px]">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Sự kiện <span className="text-primary-500">mới nhất</span>
          </h2>
          <Button
            type="button"
            className="bg-primary-100 text-primary-500 hover:bg-primary-200"
            onClick={() => router.push('/event/search')}
          >
            Xem thêm
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {newestEventsLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            newestEvents &&
            newestEvents.length > 0 &&
            newestEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Sắp diễn ra <span className="text-primary-500">trong 24h</span>
          </h2>
          <Button
            type="button"
            className="bg-primary-100 text-primary-500 hover:bg-primary-200"
            onClick={() => router.push('/event/search')}
          >
            Xem thêm
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {upcomingEventsLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            upcomingEvents &&
            upcomingEvents.length > 0 &&
            upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} size="large" />
            ))
          )}
        </div>
      </section>

      {/* HIGHLIGHT EVENTS */}
      <section className="my-[100px] mx-[132px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Điểm nhấn{' '}
            <span className="text-primary-500">
              trong{' '}
              {highlightEvent?.highlightType === HighlightType.WEEK
                ? 'tuần'
                : highlightEvent?.highlightType === HighlightType.MONTH
                  ? 'tháng'
                  : highlightEvent?.highlightType === HighlightType.YEAR
                    ? 'năm'
                    : 'tuần'}
            </span>
          </h2>
          <Button
            type="button"
            className="bg-primary-100 text-primary-500 hover:bg-primary-200"
            onClick={() => router.push('/event/search')}
          >
            Xem thêm
          </Button>
        </div>

        {highlightEventLoading ? (
          <>
            <Skeleton className="h-[349px]" />
          </>
        ) : (
          <div className="w-full p-[60px] bg-slate-600 grid grid-cols-2 gap-[60px] relative rounded-m overflow-hidden">
            {highlightEvent && highlightEvent.event && (
              <>
                {highlightEvent.event.coverImage && (
                  <Image
                    src={highlightEvent.event.coverImage}
                    alt="highlight-event-image"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    fill
                  />
                )}
                <div className="z-10">
                  <HighlightEventCard event={highlightEvent.event} />
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* MORE EVENTS */}
      <section className="my-[100px] mx-[132px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Nhiều sự kiện hơn
          </h2>
          <Button
            type="button"
            className="bg-primary-100 text-primary-500 hover:bg-primary-200"
            onClick={() => router.push('/event/search')}
          >
            Xem thêm
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {randomEventsLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            randomEvents &&
            randomEvents.length > 0 &&
            randomEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </section>
    </>
  );
};

ExplorePage.Layout = CustomerLayout;

export default ExplorePage;
