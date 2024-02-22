import { DashboardCard } from '@/components/dashboard';
import { columns } from '@/components/event';
import { OrganizerLayout } from '@/components/layout';
import { Loading } from '@/components/ui';
import { DataTable } from '@/components/ui/data-table';
import { useAuth, useEventsByOrganizer } from '@/hooks';
import { useEventsStatisticByOrganizer } from '@/hooks/use-events-statistic-by-organizer';
import { NextPageWithLayout } from '@/models';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { LuBarChart, LuCalendar, LuTicket } from 'react-icons/lu';

const MyEventsPage: NextPageWithLayout = () => {
  const { profile } = useAuth();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { events, meta, isLoading } = useEventsByOrganizer(profile!.id, {
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    takeAll: false
  });

  const { eventsStatistic } = useEventsStatisticByOrganizer(profile!.id);

  return (
    profile?.id && (
      <div className="w-full px-[132px] py-20">
        <h1 className="text-[32px] leading-[48px] font-bold mb-10">
          Sự kiện của tôi
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
    )
  );
};

MyEventsPage.Layout = OrganizerLayout;

export default MyEventsPage;
