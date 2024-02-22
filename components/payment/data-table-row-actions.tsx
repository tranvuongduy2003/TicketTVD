'use client';

import { Row } from '@tanstack/react-table';
import { LuMoreHorizontal } from 'react-icons/lu';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui';
import { Payment, Role } from '@/models';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks';
import Link from 'next/link';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const { eventId } = router.query;

  const { profile } = useAuth();

  const paymentId = (row.original as Payment).id;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <LuMoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <Link
            href={
              profile?.role === Role.ADMIN
                ? `/management/payment/${paymentId}`
                : profile?.role === Role.ORGANIZER
                ? `/my-events/${eventId}/payment/${paymentId}`
                : ''
            }
          >
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
