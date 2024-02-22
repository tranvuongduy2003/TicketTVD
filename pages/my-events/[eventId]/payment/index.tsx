import { DashboardCard } from '@/components/dashboard';
import { OrganizerLayout } from '@/components/layout';
import { columns } from '@/components/payment';
import { Loading } from '@/components/ui';
import { DataTable } from '@/components/ui/data-table';
import { usePaymentsByEventId, usePaymentsStatistic } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { PaginationState } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LuBarChart, LuReceipt, LuTicket } from 'react-icons/lu';

const MyEventsPaymentPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { payments, meta, isLoading } = usePaymentsByEventId(
    eventId as string,
    {
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      takeAll: false
    }
  );

  const { paymentsStatistic } = usePaymentsStatistic(eventId as string);

  return (
    <div className="w-full px-[132px] py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý đơn mua
      </h1>

      <div className="grid grid-cols-3 gap-8 mb-7">
        <DashboardCard
          primaryColor="#F26298FF"
          borderColor="#FBCDDEFF"
          bgColor="#FEF1F6FF"
          icon={<LuReceipt />}
          content={paymentsStatistic?.totalPayments || 0}
          title="Tổng số đơn mua"
        />
        <DashboardCard
          primaryColor="#7AA874FF"
          borderColor="#D7E5D5FF"
          bgColor="#F6F9F6FF"
          icon={<LuTicket />}
          content={paymentsStatistic?.totalBoughtTickets || 0}
          title="Vé đã bán"
        />
        <DashboardCard
          primaryColor="#637BF2FF"
          borderColor="#CDD5FBFF"
          bgColor="#F1F3FEFF"
          icon={<LuBarChart />}
          content={'' + paymentsStatistic?.totalRevenue || 0 + ' VNĐ'}
          title="Doanh thu"
        />
      </div>

      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            data={payments || []}
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

MyEventsPaymentPage.Layout = OrganizerLayout;

export default MyEventsPaymentPage;
