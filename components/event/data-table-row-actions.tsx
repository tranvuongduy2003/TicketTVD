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
import { Event, Role } from '@/models';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RemoveEventConfirmDialog } from '.';
import { useAuth } from '@/hooks';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const { profile } = useAuth();
  const router = useRouter();

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
          <DropdownMenuItem
            onClick={() =>
              profile?.role === Role.ADMIN
                ? router.push(`/management/event/${eventId}`)
                : profile?.role === Role.ORGANIZER &&
                  router.push(`/event/${eventId}/edit`)
            }
          >
            Chỉnh sửa
          </DropdownMenuItem>
          {profile?.role === Role.ORGANIZER && (
            <DropdownMenuItem
              onClick={() => router.push(`/my-events/${eventId}/payment`)}
            >
              Đơn mua
            </DropdownMenuItem>
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
