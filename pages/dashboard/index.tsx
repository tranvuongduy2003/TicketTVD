import {
  DashboardCard,
  EventsByCategoryChart,
  RevenueChart,
  eventColumns,
  paymentColumns
} from '@/components/dashboard';
import { DataTable } from '@/components/dashboard/data-table';
import { AdminLayout } from '@/components/layout';
import {
  useCategories,
  useEvents,
  useEventsByCategory,
  usePayments,
  useRevuene,
  useTickets,
  useUsers
} from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { dayDiffFromNow } from '@/utils';
import {
  LuAperture,
  LuBarChart3,
  LuCalendar,
  LuSlack,
  LuTicket,
  LuUser
} from 'react-icons/lu';

export interface DashboardProps {}

const Dashboard: NextPageWithLayout = (props: DashboardProps) => {
  const { revenue } = useRevuene();
  const { events } = useEvents();
  const { users } = useUsers();
  const { categories } = useCategories();
  const { tickets } = useTickets();
  const { payments } = usePayments();
  const { eventStatistic } = useEventsByCategory();

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
          content={events?.length}
          title="Sự kiện"
        />
        <DashboardCard
          primaryColor="#7AA874FF"
          borderColor="#D7E5D5FF"
          bgColor="#F6F9F6FF"
          icon={<LuTicket />}
          content={tickets?.length}
          title="Vé đã bán"
        />
        <DashboardCard
          primaryColor="#637BF2FF"
          borderColor="#CDD5FBFF"
          bgColor="#F1F3FEFF"
          icon={<LuAperture />}
          content={categories?.length}
          title="Thể loại"
        />
        <DashboardCard
          primaryColor="#EBAE11FF"
          borderColor="#FEF9EEFF"
          bgColor="#FAE7B6FF"
          icon={<LuUser />}
          content={users?.length}
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
            <EventsByCategoryChart
              categories={categories || []}
              eventsByCategory={eventStatistic || []}
            />
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
          <p className="text-sm text-neutral-550">
            Sự kiện gần đây nhất:{' '}
            {dayDiffFromNow(
              events?.sort(
                (a, b) =>
                  new Date(b.eventDate).getTime() -
                  new Date(a.eventDate).getTime()
              )[0].eventDate ?? new Date()
            )}
          </p>
        </div>
        <DataTable
          data={
            events?.sort(
              (a, b) =>
                new Date(b.eventDate).getTime() -
                new Date(a.eventDate).getTime()
            ) || []
          }
          columns={eventColumns}
        />
      </div>

      <div className="mt-14">
        <div className="mb-6 mt-11 flex items-center justify-between">
          <h2 className="flex items-center text-2xl font-bold gap-3">
            <LuTicket className="text-primary-500" />
            <span>Đơn mua gần đây</span>
          </h2>
          <p className="text-sm text-neutral-550">
            Cập nhật mới nhất:{' '}
            {dayDiffFromNow(
              payments?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )[0].createdAt ?? new Date()
            )}
          </p>
        </div>
        <DataTable
          data={
            payments
              ?.map(item => {
                const user = users?.find(u => u.id == item.userId);

                return { ...item, user: user };
              })
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              ) || []
          }
          columns={paymentColumns}
        />
      </div>
    </div>
  );
};

Dashboard.Layout = AdminLayout;

export default Dashboard;
