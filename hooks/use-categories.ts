import { categoryApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import { FilteringOptions } from '@/models';
import { useEffect } from 'react';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useCategories(
  filter?: Partial<FilteringOptions>,
  options?: Partial<SWRConfiguration>
) {
  const {
    data: categories,
    mutate,
    error
  } = useSWR(
    QUERY_KEY.categories,
    async () => {
      const { data } = await categoryApi.getCategories(filter);
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

  return { categories, mutate, error, isLoading: !error && !categories };
}
