'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Payment } from '@/models';
import Image from 'next/image';
import { EventDateTag } from '../event/event-date-tag';
import { DataTableColumnHeader } from './data-table/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';

export const paymentColumns: ColumnDef<Payment>[] = [
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
      <DataTableColumnHeader column={column} title="Người mua" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage
            src={row.original.user?.avatar || ''}
            suppressHydrationWarning
            style={{ objectFit: 'cover' }}
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <span className="font-bold">{row.original.customerName}</span>
      </div>
    ),
    enableSorting: true,
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
    enableSorting: true,
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
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số lượng vé" />
    ),
    cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    enableSorting: true,
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
    enableSorting: true,
    enableHiding: false
  }
];
