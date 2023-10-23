'use client';

import { LayoutProps } from '@/models';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/router';

export function AuthLayout({ children }: LayoutProps) {
  const router = useRouter();

  const { profile } = useAuthStore();

  if (profile !== null && Boolean(profile?.id)) router.push('/');

  return <>{children}</>;
}
