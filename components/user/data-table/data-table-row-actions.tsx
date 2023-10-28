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
import { User } from '@/models';
import { useState } from 'react';
import { DisableConfirmationDialog, EditUserDialog } from '..';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDisableConfirmationDialogOpen, setIsDisableConfirmationDialogOpen] =
    useState<boolean>(false);

  const userId = (row.original as User).id;

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
          <DropdownMenuItem>
            <span
              className="text-danger-500"
              onClick={() => setIsDisableConfirmationDialogOpen(true)}
            >
              Vô hiệu hóa
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditDialogOpen && (
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userId={userId}
        />
      )}
      {isDisableConfirmationDialogOpen && (
        <DisableConfirmationDialog
          open={isDisableConfirmationDialogOpen}
          onOpenChange={setIsDisableConfirmationDialogOpen}
          onOk={() => {}}
        />
      )}
    </>
  );
}
