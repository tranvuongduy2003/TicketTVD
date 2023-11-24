'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Event } from '@/models';
import Image from 'next/image';
import { DataTableRowActions } from './data-table';
import { DataTableColumnHeader } from './data-table/data-table-column-header';
import { EventDateTag } from './event-date-tag';

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sự kiện" />
    ),
    cell: ({ row }) => (
      <div className="flex flew-row items-center gap-9">
        <Image
          src={row.original.coverImage || '/logo.png'}
          width={80}
          height={53}
          alt="event-cover-image"
          style={{
            objectFit: 'cover',
            minHeight: '53px',
            maxHeight: '53px',
            minWidth: '80px',
            maxWidth: '80px'
          }}
          className="rounded-m"
        />
        <div>{row.original.name}</div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'eventDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày diễn ra" />
    ),
    cell: ({ row }) => {
      const createdDate = new Date(row.getValue('eventDate'));
      return (
        <div className="flex items-center justify-between">
          <span>{createdDate.toLocaleDateString('vi-VN')}</span>
          <EventDateTag eventDate={createdDate} />
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'ticketQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vé đã bán" />
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue('ticketSoldQuantity') || 0} /{' '}
        {row.getValue('ticketQuantity')}
      </div>
    ),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'ticketPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doanh thu (VNĐ)" />
    ),
    cell: ({ row }) => (
      <div>
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(row.getValue('ticketPrice'))}
      </div>
    ),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'action',
    header: () => <></>,
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false
  }
];
