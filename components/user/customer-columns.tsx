'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Status, User } from '@/models';
import { Avatar, AvatarFallback, AvatarImage, Badge } from '../ui';
import { DataTableRowActions } from './data-table';
import { DataTableColumnHeader } from './data-table/data-table-column-header';

export const customerColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage
          src={row.getValue('avatar') || ''}
          suppressHydrationWarning
          style={{ objectFit: 'cover' }}
        />
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Họ tên" />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tham gia" />
    ),
    cell: ({ row }) => {
      const createdDate = new Date(row.getValue('createdAt'));
      return <div>{createdDate.toLocaleDateString('vi-VN')}</div>;
    },
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'totalBuyedTickets',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng số vé đã mua" />
    ),
    cell: ({ row }) => <div>{row.getValue('totalBuyedTickets')}</div>,
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status');
      switch (status) {
        case Status.ACTIVE:
          return (
            <div>
              <Badge className="bg-success-100 text-success-700 hover:bg-success-100 hover:text-success-700">
                Hoạt động
              </Badge>
            </div>
          );

        case Status.DEACTIVE:
          return (
            <div>
              <Badge className="bg-danger-100 text-danger-500 hover:bg-danger-100 hover:text-danger-500">
                Ngưng hoạt động
              </Badge>
            </div>
          );

        default:
          break;
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
