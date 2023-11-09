import { AdminLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';

export interface EventProps {}

const Event: NextPageWithLayout = (props: EventProps) => {
  return <div>Event</div>;
};

Event.Layout = AdminLayout;

export default Event;
