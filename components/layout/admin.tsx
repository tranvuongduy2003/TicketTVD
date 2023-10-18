import { LayoutProps } from '@/models';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/router';
import { Header, Sidebar } from '../common';

export function AdminLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { profile } = useAuthStore();

  // if (!profile?.id || profile?.role !== Role.ADMIN) router.push('/auth/login');

  return (
    <>
      <Header />
      <main className="flex w-full">
        <Sidebar />
        <section className="flex-1">{children}</section>
      </main>
    </>
  );
}
