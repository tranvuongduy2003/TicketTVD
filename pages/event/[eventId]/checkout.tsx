import { CustomerLayout, MainLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';
import { useRouter } from 'next/router';

const EventDetailPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { eventId } = query;

  return <div>Checkout </div>;
};

EventDetailPage.Layout = CustomerLayout;

export default EventDetailPage;
