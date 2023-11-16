import { useAuth } from '@/hooks';
import { LayoutProps, Role } from '@/models';
import Router from 'next/router';
import { useLayoutEffect } from 'react';

export function OrganizerLayout({ children }: LayoutProps) {
  const { profile, isLoading } = useAuth();

  useLayoutEffect(() => {
    if (!isLoading && (!profile || profile.role !== Role.ORGANIZER)) {
      Router.push('/auth/login');
    }
  }, [isLoading, profile]);

  return <>{children}</>;
}
