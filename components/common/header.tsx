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
  const { profile } = useAuth();

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
