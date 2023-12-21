'use client';

import { Table } from '@tanstack/react-table';
import { Button, Input } from '../../ui';
import { LuPlus } from 'react-icons/lu';
import Link from 'next/link';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Tìm kiếm"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-10 w-[150px] lg:w-[300px]"
        />
      </div>
      <div>
        <Link href={'category/create'}>
          <Button className="text-white gap-2">
            <LuPlus /> Tạo thể loại mới
          </Button>
        </Link>
      </div>
    </div>
  );
}
