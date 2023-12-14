'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { BsCreditCard } from 'react-icons/bs';
import { LuCalendar, LuLayoutDashboard, LuUser } from 'react-icons/lu';
import { MdOutlineCategory } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

const components: { title: string; href: string; icon: ReactElement }[] = [
  {
    title: 'Bảng điều khiển',
    href: '/dashboard',
    icon: <LuLayoutDashboard />
  },
  {
    title: 'Quản lý sự kiện',
    href: '/management/event',
    icon: <LuCalendar />
  },
  {
    title: 'Quản lý đơn mua',
    href: '/management/payment',
    icon: <BsCreditCard />
  },
  {
    title: 'Quản lý người dùng',
    href: '/management/user',
    icon: <LuUser />
  },
  {
    title: 'Quản lý thể loại',
    href: '/management/category',
    icon: <MdOutlineCategory />
  }
];

export function Sidebar() {
  const router = useRouter();

  return (
    <aside className="min-h-screen py-[22px] px-[15px] w-60 shadow-xs bg-neutral-100">
      <ul className="flex flex-col items-stretch gap-y-4">
        {components.map((item, index) => (
          <Link key={index} href={item.href}>
            <li
              className={twMerge(
                'ease-linear transition-all bg-transparent hover:bg-slate-200 w-full px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-normal leading-5 text-neutral-600',
                router.pathname.includes(item.href) &&
                  'bg-primary-500 text-white font-bold hover:bg-primary-600'
              )}
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.title}</span>
            </li>
          </Link>
        ))}
      </ul>
    </aside>
  );
}
