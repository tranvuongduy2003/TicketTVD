import { DashboardCard } from '@/components/dashboard';
import { columns } from '@/components/event';
import { DataTable } from '@/components/event/data-table';
import { OrganizerLayout } from '@/components/layout';
import { useAuth, useEvents, usePayments, usePaymentsByUserId } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { LuAperture, LuBarChart, LuCalendar, LuTicket } from 'react-icons/lu';

const MyEventsPage: NextPageWithLayout = () => {
  const { profile } = useAuth();
  const { events } = useEvents(profile?.id);
  const { payments } = usePaymentsByUserId(profile?.id);

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
            content={events?.length}
            title="Tổng số sự kiện"
          />
          <DashboardCard
            primaryColor="#7AA874FF"
            borderColor="#D7E5D5FF"
            bgColor="#F6F9F6FF"
            icon={<LuTicket />}
            content={events?.reduce(
              (prevValue, currentEvent) =>
                prevValue + currentEvent.ticketSoldQuantity,
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
          <DataTable data={events || []} columns={columns} />
        </div>
      </div>
    )
  );
};

MyEventsPage.Layout = OrganizerLayout;

export default MyEventsPage;
