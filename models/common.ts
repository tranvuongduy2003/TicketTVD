import { ColumnDef, PaginationState, Table } from '@tanstack/react-table';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export type NextPageWithLayout = NextPage & {
  Layout?: (props: LayoutProps) => ReactElement;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface Meta {
  currentPage: number;
  totalPages: number;
  takeAll: boolean;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ApiResponse<T = any> {
  data?: T;
  isSuccess: boolean;
  message: string;
  meta?: Meta;
}

export enum PageOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface FilteringOptions {
  page: number;
  size: number;
  takeAll: boolean;
  order: PageOrder;
  search: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: Meta;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}
