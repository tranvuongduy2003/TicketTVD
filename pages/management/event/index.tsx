import { DashboardCard } from '@/components/dashboard';
import { columns } from '@/components/event';
import { AdminLayout } from '@/components/layout';
import { Loading } from '@/components/ui';
import { DataTable } from '@/components/ui/data-table';
import { useEvents, useEventsStatistic } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { LuBarChart, LuCalendar, LuTicket } from 'react-icons/lu';

const EventPage: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { events, meta, isLoading } = useEvents({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    takeAll: false
  });

  const { eventsStatistic } = useEventsStatistic();

  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý sự kiện
      </h1>

      <div className="grid grid-cols-3 gap-8 mb-7">
        <DashboardCard
          primaryColor="#F26298FF"
          borderColor="#FBCDDEFF"
          bgColor="#FEF1F6FF"
          icon={<LuCalendar />}
          content={eventsStatistic?.totalEvents || 0}
          title="Tổng số sự kiện"
        />
        <DashboardCard
          primaryColor="#7AA874FF"
          borderColor="#D7E5D5FF"
          bgColor="#F6F9F6FF"
          icon={<LuTicket />}
          content={eventsStatistic?.totalBoughtTickets || 0}
          title="Vé đã bán"
        />
        <DashboardCard
          primaryColor="#637BF2FF"
          borderColor="#CDD5FBFF"
          bgColor="#F1F3FEFF"
          icon={<LuBarChart />}
          content={
            '' + (eventsStatistic?.revenue || 0).toLocaleString() + ' VNĐ'
          }
          title="Doanh thu"
        />
      </div>

      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            data={events || []}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
            meta={meta}
          />
        )}
      </div>
    </div>
  );
};

EventPage.Layout = AdminLayout;

export default EventPage;
