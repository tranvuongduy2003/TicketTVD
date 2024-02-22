'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '..';

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
          value={
            (table.getColumn('customerName')?.getFilterValue() as string) ?? ''
          }
          onChange={event =>
            table.getColumn('customerName')?.setFilterValue(event.target.value)
          }
          className="h-10 w-[150px] lg:w-[300px]"
        />
      </div>
    </div>
  );
}
