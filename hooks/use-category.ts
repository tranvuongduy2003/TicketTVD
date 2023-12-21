import { categoryApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useCategory(id: number, options?: Partial<SWRConfiguration>) {
  const {
    data: category,
    error,
    isLoading
  } = useSWR(QUERY_KEY.category, () => categoryApi.getCategoryById(id), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...options
  });

  return { category, error, isLoading };
}
