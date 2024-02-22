'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Payment } from '@/models';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';
import { DataTableColumnHeader } from '../ui/data-table/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đơn" />
    ),
    cell: ({ row }) => (
      <div className="text-blue-500">#{row.getValue('id')}</div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thông tin liên hệ" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={row.original.user?.avatar || ''}
            suppressHydrationWarning
            style={{ objectFit: 'cover' }}
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <div className="flex gap-1 flex-col">
          <span className="font-bold">{row.original.customerName}</span>
          <span>{row.original.customerEmail}</span>
          <span>{row.original.customerPhone}</span>
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày thanh toán" />
    ),
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue('createdAt')).toLocaleDateString('vi-VN')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thời gian" />
    ),
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue('createdAt')).toLocaleTimeString('vi-VN', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số lượng vé" />
    ),
    cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'totalPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng tiền" />
    ),
    cell: ({ row }) => (
      <div>{(row.getValue('totalPrice') as number).toLocaleString()} VNĐ</div>
    ),
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
