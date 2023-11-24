import { columns } from '@/components/event';
import { AdminLayout } from '@/components/layout';
import { DataTable } from '@/components/event/data-table';
import { useEvents } from '@/hooks';
import { NextPageWithLayout } from '@/models';

const EventPage: NextPageWithLayout = () => {
  const { events } = useEvents();

  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý sự kiện
      </h1>

      <div>
        <DataTable data={events || []} columns={columns} />
      </div>
    </div>
  );
};

EventPage.Layout = AdminLayout;

export default EventPage;
