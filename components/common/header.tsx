'use client';

import { useAuthStore } from '@/stores';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LuChevronDown, LuLogOut, LuUser } from 'react-icons/lu';
import { twMerge } from 'tailwind-merge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '../ui';

export function Header() {
  const router = useRouter();
  const { profile } = useAuthStore();

  return (
    <header className="px-8 h-14 flex items-center shadow-xs justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-[6px]">
        <Link href={'/'} className="flex items-center gap-[6px]">
          <div>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={43}
              height={43}
              objectFit="cover"
            />
          </div>
          <h2 className="text-lg font-bold leading-7">
            <span className="text-neutral-700">Ticket</span>
            <span className="text-primary-500">TVD</span>
          </h2>
        </Link>
        <NavigationMenu className="h-full">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/user" legacyBehavior passHref>
                <NavigationMenuLink
                  className={twMerge(
                    'ease-linear transition-all bg-transparent hover:bg-slate-200 px-6 py-4 text-sm font-normal leading-6 text-neutral-600',
                    router.pathname === '/user' && 'font-bold '
                  )}
                >
                  Trang chủ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/upcoming" legacyBehavior passHref>
                <NavigationMenuLink
                  className={twMerge(
                    'ease-linear transition-all bg-transparent hover:bg-slate-200 px-6 py-4 text-sm font-normal leading-6 text-neutral-600',
                    router.pathname === '/upcoming' && 'font-bold '
                  )}
                >
                  Sắp diễn ra
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* RIGHT */}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profile?.avatar} suppressHydrationWarning />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <div>
              <h3
                className="text-sm leading-[22px] text-neutral-900"
                suppressHydrationWarning
              >
                {profile?.name}
              </h3>
            </div>
            <LuChevronDown className="text-xs text-neutral-500" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem className="cursor-pointer px-3 py-2">
            <LuUser className="mr-2 text-base" />
            <span className="text-base">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer px-3 py-2">
            <LuLogOut className="mr-2 text-base" />
            <span className="text-base">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
