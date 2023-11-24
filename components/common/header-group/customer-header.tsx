'use client';

import { useProfileStore } from '@/stores';
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
} from '../../ui';
import { useAuth } from '@/hooks';

export function CustomerHeader() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const { logOut } = useAuth();

  return (
    <header className="px-8 h-14 flex items-center shadow-xs justify-between">
      {/* LEFT */}
      <Link href={'/explore'} className="flex items-center gap-[6px]">
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

      {/* CENTER */}
      <NavigationMenu className="h-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/explore" legacyBehavior passHref>
              <NavigationMenuLink
                className={twMerge(
                  'ease-linear transition-all bg-transparent hover:bg-slate-200 px-6 py-4 text-sm font-normal leading-6 text-neutral-600',
                  router.pathname === '/explore' &&
                    'font-bold border-b-4 border-primary-500 text-primary-500'
                )}
              >
                Khám phá
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/upcoming" legacyBehavior passHref>
              <NavigationMenuLink
                className={twMerge(
                  'ease-linear transition-all bg-transparent hover:bg-slate-200 px-6 py-4 text-sm font-normal leading-6 text-neutral-600',
                  router.pathname === '/upcoming' &&
                    'font-bold border-b-4 border-primary-500 text-primary-500'
                )}
              >
                Sắp diễn ra
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/my-ticket" legacyBehavior passHref>
              <NavigationMenuLink
                className={twMerge(
                  'ease-linear transition-all bg-transparent hover:bg-slate-200 px-6 py-4 text-sm font-normal leading-6 text-neutral-600',
                  router.pathname === '/my-ticket' &&
                    'font-bold border-b-4 border-primary-500 text-primary-500'
                )}
              >
                Vé của tôi
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* RIGHT */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={profile?.avatar}
                suppressHydrationWarning
                style={{ objectFit: 'cover' }}
              />
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
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2"
            onClick={() => router.push('/profile')}
          >
            <LuUser className="mr-2 text-base" />
            <span className="text-base">Thông tin cá nhân</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2"
            onClick={() => logOut()}
          >
            <LuLogOut className="mr-2 text-base" />
            <span className="text-base">Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
