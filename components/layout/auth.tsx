import { useProfile } from '@/hooks';
import { LayoutProps } from '@/models';
import { useRouter } from 'next/router';

export function AuthLayout({ children }: LayoutProps) {
  const router = useRouter();

  const { profile } = useProfile();

  if (profile?.id) router.push('/');

  return <>{children}</>;
}
