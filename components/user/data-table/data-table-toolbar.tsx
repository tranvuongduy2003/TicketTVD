'use client';

import { Table } from '@tanstack/react-table';
import { LuPlusCircle } from 'react-icons/lu';
import { Button, Input } from '../../ui';

import { Status } from '@/models';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Tìm kiếm"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-10 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Trạng thái"
            options={[
              {
                label: 'Hoạt động',
                value: Status.ACTIVE
              },
              {
                label: 'Ngưng hoạt động',
                value: Status.DEACTIVE
              }
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-2 lg:px-3"
          >
            Khôi phục
            <LuPlusCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
