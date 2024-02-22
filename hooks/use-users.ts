import { userApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import { FilteringOptions } from '@/models';
import { useEffect } from 'react';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useUsers(
  filter?: Partial<FilteringOptions>,
  options?: Partial<SWRConfiguration>
) {
  const {
    data: users,
    error,
    mutate
  } = useSWR(
    QUERY_KEY.users,
    async () => {
      const { data } = await userApi.getUsers(filter);
      return data;
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  useEffect(() => {
    mutate();
  }, [
    filter?.order,
    filter?.page,
    filter?.size,
    filter?.search,
    filter?.takeAll,
    mutate
  ]);

  return { users, mutate, error, isLoading: !error && !users };
}
