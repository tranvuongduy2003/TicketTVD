'use client';

import { useAuth } from '@/hooks';
import { Role } from '@/models';
import {
  AdminHeader,
  CustomerHeader,
  MainHeader,
  OrganizerHeader
} from './header-group';

export function Header() {
  const { profile } = useAuth({
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    errorRetryCount: 0,
    errorRetryInterval: 0,
    keepPreviousData: false
  });

  return !profile ? (
    <MainHeader />
  ) : profile.role === Role.ADMIN ? (
    <AdminHeader />
  ) : profile.role === Role.CUSTOMER ? (
    <CustomerHeader />
  ) : profile.role === Role.ORGANIZER ? (
    <OrganizerHeader />
  ) : (
    <MainHeader />
  );
}
