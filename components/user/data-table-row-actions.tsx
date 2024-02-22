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
import { Status, User } from '@/models';
import { useState } from 'react';
import { ConfirmationDialog, EditUserDialog } from '.';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);

  const userId = (row.original as User).id;
  const status = (row.original as User).status as Status;

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
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Chỉnh sửa
          </DropdownMenuItem>
          {status === Status.ACTIVE && (
            <DropdownMenuItem onClick={() => setIsConfirmationDialogOpen(true)}>
              <span className="text-danger-500">Vô hiệu hóa</span>
            </DropdownMenuItem>
          )}
          {status === Status.DEACTIVE && (
            <DropdownMenuItem onClick={() => setIsConfirmationDialogOpen(true)}>
              <span className="text-green-700">Kích hoạt</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditDialogOpen && (
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userId={userId}
        />
      )}
      {isConfirmationDialogOpen && (
        <ConfirmationDialog
          open={isConfirmationDialogOpen}
          onOpenChange={setIsConfirmationDialogOpen}
          userId={userId}
          status={status}
        />
      )}
    </>
  );
}
