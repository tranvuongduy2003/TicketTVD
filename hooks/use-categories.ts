import { categoryApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useCategories(options?: Partial<SWRConfiguration>) {
  const {
    data: categories,
    error,
    isLoading
  } = useSWR(QUERY_KEY.categories, () => categoryApi.getCategories(), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...options
  });

  return { categories, error, isLoading };
}
