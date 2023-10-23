import { AuthLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const UnAuthorized: NextPageWithLayout = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/auth/login'), 1500);
    () => clearTimeout(timer);
  }, [router]);

  return <div>Tài khoản không hợp lệ</div>;
};

UnAuthorized.Layout = AuthLayout;

export default UnAuthorized;
