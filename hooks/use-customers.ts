import { userApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import { FilteringOptions } from '@/models';
import { useEffect } from 'react';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useCustomers(
  filter?: Partial<FilteringOptions>,
  options?: Partial<SWRConfiguration>
) {
  const { data, error, mutate } = useSWR(
    QUERY_KEY.users + '/customers',
    async () => {
      const { data, meta } = await userApi.getUsersInCustomer(filter);
      return { users: data, meta };
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

  return {
    users: data?.users,
    meta: data?.meta,
    mutate,
    error,
    isLoading: !error && !data
  };
}
