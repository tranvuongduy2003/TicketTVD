'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui';

export function Footer() {
  return (
    <footer className="px-32 py-8 bg-neutral-900 flex justify-between items-center">
      <div className="border-neutral-500 text-neutral-400 w-40">
        <Select defaultValue="vi">
          <SelectTrigger className="w-[180px] bg-transparent">
            <SelectValue placeholder="Ngôn ngữ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vi">Tiếng Việt</SelectItem>
            <SelectItem value="en">Tiếng Anh</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <span className="text-neutral-500 text-center">
          © Copyright Tran Vuong Duy, 2023
        </span>
      </div>
      <div className="w-40">
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
            <span className="text-white">Ticket</span>
            <span className="text-primary-500">TVD</span>
          </h2>
        </Link>
      </div>
    </footer>
  );
}
