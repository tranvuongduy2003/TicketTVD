'use client';

import { useAuth } from '@/hooks';
import { LayoutProps, Role } from '@/models';
import Router from 'next/router';
import { useLayoutEffect } from 'react';
import { Footer, Header, Sidebar } from '../common';

export function AdminLayout({ children }: LayoutProps) {
  const { profile, isLoading } = useAuth();

  useLayoutEffect(() => {
    if (!isLoading && (!profile || profile.role !== Role.ADMIN)) {
      Router.push('/auth/login');
    }
  }, [isLoading, profile]);

  return (
    <>
      <Header />
      <main className="flex w-full">
        <Sidebar />
        <section className="flex-1">{children}</section>
      </main>
      <Footer />
    </>
  );
}
