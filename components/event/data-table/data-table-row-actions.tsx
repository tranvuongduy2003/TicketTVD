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
import { useAuth } from '@/hooks';
import { Event, Role } from '@/models';
import Link from 'next/link';
import { useState } from 'react';
import { RemoveEventConfirmDialog } from '..';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const { profile } = useAuth();

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);

  const eventId = (row.original as Event).id;

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
                ? `/management/event/${eventId}`
                : profile?.role === Role.ORGANIZER
                ? `/event/${eventId}/edit`
                : ''
            }
          >
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
          </Link>
          {profile?.role === Role.ORGANIZER && (
            <Link href={`/my-events/${eventId}/payment`}>
              <DropdownMenuItem>Đơn mua</DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuItem onClick={() => setIsConfirmationDialogOpen(true)}>
            <span className="text-danger-500">Xóa sự kiện</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isConfirmationDialogOpen && (
        <RemoveEventConfirmDialog
          open={isConfirmationDialogOpen}
          onOpenChange={setIsConfirmationDialogOpen}
          eventId={eventId}
        />
      )}
    </>
  );
}
