import { EventSearchBar, FilterBar, SearchEventCard } from '@/components/event';
import { MainLayout } from '@/components/layout';
import { Skeleton } from '@/components/ui';
import { DataTablePagination } from '@/components/ui/data-table';
import { useCategories, useEvents } from '@/hooks';
import { Event, NextPageWithLayout } from '@/models';
import {
  PaginationState,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

const PER_PAGE = 3;

const EventSearchPage: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PER_PAGE
  });
  const [filteredEvents, setFilteredEvents] = useState<Event[]>();
  const [searchEventValue, setSearchEventValue] = useState<string>();

  const {
    events,
    meta,
    isLoading: eventLoading
  } = useEvents({
    search: searchEventValue,
    takeAll: false,
    page: pagination.pageIndex + 1,
    size: PER_PAGE
  });
  const { categories, isLoading: categoryLoading } = useCategories();

  const table = useReactTable({
    data: events || [],
    columns: [],
    state: {
      pagination
    },
    manualPagination: true,
    pageCount: meta?.totalPages || 0,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel()
  });

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  return (
    <div className="py-14 px-32">
      <h1 className="text-[56px] leading-[78px] font-bold mb-[34px] text-center">
        Tìm kiếm sự kiện
      </h1>

      <div className="px-[134px] mb-11">
        <EventSearchBar onSearch={setSearchEventValue} />
      </div>

      <div className="flex gap-6 mb-[106px]">
        <div>
          {categoryLoading ? (
            <>
              <Skeleton className="h-[1000px]" />
            </>
          ) : (
            categories &&
            categories.length > 0 && (
              <FilterBar
                events={events || []}
                setFilter={setFilteredEvents}
                categories={categories}
              />
            )
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm my-5">
            <span className="font-bold">{meta?.totalCount}</span> kết quả
          </p>
          <div className="flex flex-col gap-8">
            {eventLoading ? (
              <>
                <Skeleton className="h-[221px]" />
                <Skeleton className="h-[221px]" />
                <Skeleton className="h-[221px]" />
              </>
            ) : (
              events &&
              events.length > 0 &&
              events.map(event => (
                <SearchEventCard key={event.id} event={event} />
              ))
            )}
          </div>
          <div className="mt-8">
            <DataTablePagination table={table} />
          </div>
          {/* <div className="mt-8 flex justify-center">
            {filteredEvents &&
              (page * PER_PAGE < filteredEvents.length ? (
                <Button
                  type="button"
                  className="text-white"
                  onClick={() => setPage(curPage => curPage + 1)}
                >
                  Xem thêm
                </Button>
              ) : (
                filteredEvents.length < PER_PAGE && (
                  <Button
                    type="button"
                    className="text-white"
                    onClick={() => setPage(1)}
                  >
                    Thu gọn
                  </Button>
                )
              ))}
          </div> */}
        </div>
      </div>

      {/* <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-bold leading-[48px]">
            <span className="text-primary-500">Gợi ý</span> cho bạn
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
              .slice(0, 2)
              .map(event => (
                <EventCard key={event.id} event={event} size="large" />
              ))
          )}
        </div>
      </div> */}
    </div>
  );
};

EventSearchPage.Layout = MainLayout;

export default EventSearchPage;
