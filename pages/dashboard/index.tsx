import { AdminLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';

export interface DashboardProps {}

const Dashboard: NextPageWithLayout = (props: DashboardProps) => {
  return <div>Dashboard</div>;
};

Dashboard.Layout = AdminLayout;

export default Dashboard;
