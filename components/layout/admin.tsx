'use client';
import { LayoutProps, Role } from '@/models';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Footer, Header, Sidebar } from '../common';

export function AdminLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { profile } = useAuthStore();

  useEffect(() => {
    if (!profile?.id || profile?.role !== Role.ADMIN) {
      router.push('/auth/login');
    }
  }, []);

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
