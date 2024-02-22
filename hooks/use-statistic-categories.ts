import { categoryApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import { FilteringOptions } from '@/models';
import { useEffect } from 'react';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useStatisticCategories(
  filter?: Partial<FilteringOptions>,
  options?: Partial<SWRConfiguration>
) {
  const { data, mutate, error } = useSWR(
    QUERY_KEY.categories,
    async () => {
      const { data, meta } = await categoryApi.getStatisticCategories(filter);
      return { categories: data, meta };
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
    categories: data?.categories,
    meta: data?.meta,
    mutate,
    error,
    isLoading: !error && !data
  };
}
