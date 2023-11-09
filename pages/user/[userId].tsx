import { AdminLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';
import { useRouter } from 'next/router';

const UserDetails: NextPageWithLayout = () => {
  const router = useRouter();

  const userId = router.query.userId;

  return <div>{userId}</div>;
};

UserDetails.Layout = AdminLayout;

export default UserDetails;
