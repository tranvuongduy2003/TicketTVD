import { LayoutProps, Role } from '@/models';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/router';

export function AdminLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { profile } = useAuthStore();

  if (!profile?.id || profile?.role !== Role.ADMIN) router.push('/auth/login');

  return <>{children}</>;
}
