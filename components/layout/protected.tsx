'use client';

import { LayoutProps } from '@/models';
import { Footer, Header } from '../common';
import { useAuth } from '@/hooks';
import { useLayoutEffect } from 'react';
import Router from 'next/router';

export function ProtectedLayout({ children }: LayoutProps) {
  const { profile, isLoading } = useAuth();

  useLayoutEffect(() => {
    if (!isLoading && !profile) {
      Router.push('/auth/login');
    }
  }, [isLoading, profile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
