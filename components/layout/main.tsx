'use client';

import { LayoutProps } from '@/models';
import { Footer, Header } from '../common';

export function MainLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
