import { useProfile } from '@/hooks';
import { LayoutProps, Role } from '@/models';
import { useRouter } from 'next/router';

export function AdminLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { profile } = useProfile();

  if (!profile?.id || profile?.role !== Role.ADMIN) router.push('/auth/login');

  return <>{children}</>;
}
