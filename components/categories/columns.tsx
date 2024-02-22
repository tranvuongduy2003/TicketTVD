'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../ui/data-table/data-table-column-header';
import { Category } from '@/models';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã thể loại" />
    ),
    cell: ({ row }) => <div>#{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên thể loại" />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'color',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Màu phân loại" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <div
          style={{
            background: row.getValue('color')
          }}
          className="rounded-md w-5 h-5"
        ></div>
        {row.getValue('color')}
      </div>
    ),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'totalEvents',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng sự kiện" />
    ),
    cell: ({ row }) => <div>{row.getValue('totalEvents')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'totalTickets',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng vé đã bán" />
    ),
    cell: ({ row }) => <div>{row.getValue('totalTickets')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'action',
    header: () => <></>,
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false
  }
];
