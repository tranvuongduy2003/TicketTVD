import { ColumnDef } from '@tanstack/react-table';
import { NextPage } from 'next';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { User } from '.';

export interface LayoutProps {
  children: ReactNode;
}

export type NextPageWithLayout = NextPage & {
  Layout?: (props: LayoutProps) => ReactElement;
};

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface ApiResponse<T = any> {
  data?: T;
  isSuccess: boolean;
  message: string;
}

export interface NextAuthSession extends Omit<Session, 'user'> {
  user: User;
  accessToken: string;
  refreshToken: string;
  error: any;
}

export interface NextAuthJWT extends JWT {
  refreshToken: string;
  accessTokenExpires: number;
  accessToken: string;
}
