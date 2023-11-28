import { columns } from '@/components/event';
import { DataTable } from '@/components/event/data-table';
import { OrganizerLayout } from '@/components/layout';
import { useAuth, useEvents } from '@/hooks';
import { NextPageWithLayout } from '@/models';

const MyEventsPage: NextPageWithLayout = () => {
  const { profile } = useAuth();
  const { events } = useEvents(profile?.id);

  return (
    profile?.id && (
      <div className="w-full px-[132px] py-20">
        <h1 className="text-[32px] leading-[48px] font-bold mb-7">
          Sự kiện của tôi
        </h1>

        <div>
          <DataTable data={events || []} columns={columns} />
        </div>
      </div>
    )
  );
};

MyEventsPage.Layout = OrganizerLayout;

export default MyEventsPage;
