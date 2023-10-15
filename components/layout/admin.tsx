import { LayoutProps } from '@/models';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/router';
import { Sidebar } from '../common';

export function AdminLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { profile } = useAuthStore();

  // if (!profile?.id || profile?.role !== Role.ADMIN) router.push('/auth/login');

  return (
    <>
      <div className="flex w-full">
        <Sidebar />
        <>{children}</>
      </div>
    </>
  );
}
