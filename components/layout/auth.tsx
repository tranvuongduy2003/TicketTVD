'use client';

import { useAuth } from '@/hooks';
import { LayoutProps, Role } from '@/models';
import Router from 'next/router';
import { useEffect } from 'react';

export function AuthLayout({ children }: LayoutProps) {
  const { profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && profile) {
      if (profile.role === Role.ADMIN) {
        Router.push('/dashboard');
      } else if (profile.role === Role.CUSTOMER) {
        Router.push('/explore');
      } else {
        Router.push('/');
      }
    }
  }, [isLoading, profile]);

  return <>{children}</>;
}
