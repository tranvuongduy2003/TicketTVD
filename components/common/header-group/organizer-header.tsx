'use client';

import { useAuth } from '@/hooks';
import { useProfileStore } from '@/stores';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LuChevronDown, LuLogOut, LuPlus, LuUser } from 'react-icons/lu';
import { twMerge } from 'tailwind-merge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '../../ui';

export function OrganizerHeader() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const { logOut } = useAuth();

  return (
    <header className="px-8 h-14 flex items-center shadow-xs justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-[6px] flex-1">
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
        <NavigationMenu className="h-full">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={twMerge(
                    'ease-linear transition-all bg-transparent hover:bg-slate-200 px-6 py-4 text-sm font-normal leading-6 text-neutral-600',
                    router.pathname === '/' &&
                      'font-bold border-b-4 border-primary-500 text-primary-500'
                  )}
                >
                  Trang chủ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/event/search" legacyBehavior passHref>
                <NavigationMenuLink
                  className={twMerge(
                    'ease-linear transition-all bg-transparent hover:bg-slate-200 px-6 py-4 text-sm font-normal leading-6 text-neutral-600',
                    router.pathname.includes('/event/search') &&
                      'font-bold border-b-4 border-primary-500 text-primary-500'
                  )}
                >
                  Sự kiện
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/my-events" legacyBehavior passHref>
                <NavigationMenuLink
                  className={twMerge(
                    'ease-linear transition-all bg-transparent hover:bg-slate-200 px-6 py-4 text-sm font-normal leading-6 text-neutral-600',
                    router.pathname.includes('/my-events') &&
                      'font-bold border-b-4 border-primary-500 text-primary-500'
                  )}
                >
                  Sự kiện của tôi
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* RIGHT */}
      <Link href={'/event/create'}>
        <Button
          type="button"
          className="text-white flex gap-2 items-center text-sm font-normal mr-6"
        >
          <LuPlus /> Tạo sự kiện
        </Button>
      </Link>
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
          <Link href={'/profile'}>
            <DropdownMenuItem className="cursor-pointer px-3 py-2">
              <LuUser className="mr-2 text-base" />
              <span className="text-base">Thông tin cá nhân</span>
            </DropdownMenuItem>
          </Link>
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
