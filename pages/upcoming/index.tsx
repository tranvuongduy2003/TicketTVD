import { MainLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';

export interface UpcomingProps {}

const Upcoming: NextPageWithLayout = (props: UpcomingProps) => {
  return <div>Upcoming</div>;
};

Upcoming.Layout = MainLayout;

export default Upcoming;
