import { DashboardCard } from '@/components/dashboard';
import { OrganizerLayout } from '@/components/layout';
import { columns } from '@/components/payment';
import { DataTable } from '@/components/payment/data-table';
import { usePaymentsByEventId } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { useRouter } from 'next/router';
import { LuBarChart, LuReceipt, LuTicket } from 'react-icons/lu';

const MyEventsPaymentPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const { payments } = usePaymentsByEventId(Number.parseInt(eventId as string));

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
          content={payments?.length}
          title="Tổng số đơn mua"
        />
        <DashboardCard
          primaryColor="#7AA874FF"
          borderColor="#D7E5D5FF"
          bgColor="#F6F9F6FF"
          icon={<LuTicket />}
          content={payments?.reduce(
            (prevValue, payment) => prevValue + payment.quantity,
            0
          )}
          title="Vé đã bán"
        />
        <DashboardCard
          primaryColor="#637BF2FF"
          borderColor="#CDD5FBFF"
          bgColor="#F1F3FEFF"
          icon={<LuBarChart />}
          content={
            '' +
            payments
              ?.reduce(
                (prevValue, payment) => prevValue + payment.totalPrice,
                0
              )
              .toLocaleString() +
            ' VNĐ'
          }
          title="Doanh thu"
        />
      </div>

      <div>
        <DataTable data={payments || []} columns={columns} />
      </div>
    </div>
  );
};

MyEventsPaymentPage.Layout = OrganizerLayout;

export default MyEventsPaymentPage;
