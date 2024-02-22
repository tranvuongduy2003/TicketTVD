'use client';

import {
  DashboardCard,
  EventsByCategoryChart,
  RevenueChart
} from '@/components/dashboard';
import { columns as eventColumns } from '@/components/event';
import { AdminLayout } from '@/components/layout';
import { columns as paymentColumns } from '@/components/payment';
import { Loading } from '@/components/ui';
import { DataTable } from '@/components/ui/data-table';
import {
  useEvents,
  useEventsByCategory,
  usePayments,
  useRevuene
} from '@/hooks';
import { useGeneralStatistic } from '@/hooks/use-general-statistic';
import { NextPageWithLayout } from '@/models';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import {
  LuAperture,
  LuBarChart3,
  LuCalendar,
  LuSlack,
  LuTicket,
  LuUser
} from 'react-icons/lu';

export interface DashboardProps {}

const Dashboard: NextPageWithLayout = () => {
  const [paymentsPagination, setPaymentsPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: 5
    }
  );
  const [eventsPagination, setEventsPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { revenue } = useRevuene();
  const { generalStatistic } = useGeneralStatistic();
  const { eventStatistic } = useEventsByCategory();

  const {
    events,
    meta: eventsMeta,
    isLoading: eventsLoading
  } = useEvents({
    page: eventsPagination.pageIndex + 1,
    size: eventsPagination.pageSize,
    takeAll: false
  });

  const {
    payments,
    meta: paymentsMeta,
    isLoading: paymentsLoading
  } = usePayments({
    page: paymentsPagination.pageIndex + 1,
    size: paymentsPagination.pageSize,
    takeAll: false
  });

  return (
    <div className="px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-4">
        Bảng điều khiển
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <DashboardCard
          primaryColor="#F26298FF"
          borderColor="#FBCDDEFF"
          bgColor="#FEF1F6FF"
          icon={<LuCalendar />}
          content={generalStatistic?.totalEvents || 0}
          title="Sự kiện"
        />
        <DashboardCard
          primaryColor="#7AA874FF"
          borderColor="#D7E5D5FF"
          bgColor="#F6F9F6FF"
          icon={<LuTicket />}
          content={generalStatistic?.totalBoughtTickets || 0}
          title="Vé đã bán"
        />
        <DashboardCard
          primaryColor="#637BF2FF"
          borderColor="#CDD5FBFF"
          bgColor="#F1F3FEFF"
          icon={<LuAperture />}
          content={generalStatistic?.totalCategories || 0}
          title="Thể loại"
        />
        <DashboardCard
          primaryColor="#EBAE11FF"
          borderColor="#FEF9EEFF"
          bgColor="#FAE7B6FF"
          icon={<LuUser />}
          content={generalStatistic?.totalUsers || 0}
          title="Người dùng"
        />
      </div>

      <div>
        <h2 className="flex items-center text-2xl font-bold gap-3 mb-6 mt-11">
          <LuBarChart3 className="text-primary-500" />
          <span>Tổng quan</span>
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-lg bg-neutral-150 flex items-center justify-center flex-col pb-4">
            <RevenueChart revenue={revenue || []} />
            <h5 className="font-semibold text-neutral-700">
              Doanh thu trong năm
            </h5>
          </div>
          <div className="rounded-lg bg-neutral-150 flex items-center justify-center flex-col pb-4">
            <EventsByCategoryChart eventsByCategory={eventStatistic || []} />
            <h5 className="font-semibold text-neutral-700">
              Thống kê sự kiện theo thể loại
            </h5>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div className="mb-6 mt-11 flex items-center justify-between">
          <h2 className="flex items-center text-2xl font-bold gap-3">
            <LuSlack className="text-primary-500" />
            <span>Thống kê theo sự kiện</span>
          </h2>
          {/* <p className="text-sm text-neutral-550">
            Sự kiện gần đây nhất:{' '}
            {dayDiffFromNow(
              events?.sort(
                (a, b) =>
                  new Date(b.startTime).getTime() -
                  new Date(a.startTime).getTime()
              )[0].startTime ?? new Date()
            )}
          </p> */}
        </div>
        {eventsLoading ? (
          <Loading />
        ) : (
          <DataTable
            data={events || []}
            columns={eventColumns}
            pagination={eventsPagination}
            setPagination={setEventsPagination}
            meta={eventsMeta}
          />
        )}
      </div>

      <div className="mt-14">
        <div className="mb-6 mt-11 flex items-center justify-between">
          <h2 className="flex items-center text-2xl font-bold gap-3">
            <LuTicket className="text-primary-500" />
            <span>Đơn mua gần đây</span>
          </h2>
          {/* <p className="text-sm text-neutral-550">
            Cập nhật mới nhất:{' '}
            {dayDiffFromNow(
              payments?.sort(
                (a, b) =>
                  (b.createdAt ? new Date(b.createdAt) : new Date()).getTime() -
                  (a.createdAt ? new Date(a.createdAt) : new Date()).getTime()
              )[0]?.createdAt ?? new Date()
            )}
          </p> */}
        </div>
        {paymentsLoading ? (
          <Loading />
        ) : (
          <DataTable
            data={payments || []}
            columns={paymentColumns}
            pagination={paymentsPagination}
            setPagination={setPaymentsPagination}
            meta={paymentsMeta}
          />
        )}
      </div>
    </div>
  );
};

Dashboard.Layout = AdminLayout;

export default Dashboard;
