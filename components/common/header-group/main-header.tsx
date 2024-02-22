'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../ui';

export function MainHeader() {
  return (
    <header className="px-8 h-14 flex items-center shadow-xs justify-between">
      {/* LEFT */}
      <Link href={'/'} className="flex items-center gap-[6px]">
        <div>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={43}
            height={60}
            style={{
              objectFit: 'cover'
            }}
          />
        </div>
        <h2 className="text-lg font-bold leading-7">
          <span className="text-neutral-700">Ticket</span>
          <span className="text-primary-500">TVD</span>
        </h2>
      </Link>

      <div className="flex gap-3">
        <Link href={'/auth/signup'}>
          <Button
            type="button"
            className="bg-primary-100 hover:bg-primary-200 text-primary-500"
          >
            Đăng ký
          </Button>
        </Link>
        <Link href={'/auth/login'}>
          <Button type="button" className="text-white">
            Đăng nhập
          </Button>
        </Link>
      </div>
    </header>
  );
}
