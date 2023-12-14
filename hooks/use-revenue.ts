import { statisticApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useRevuene(options?: Partial<SWRConfiguration>) {
  const {
    data: revenue,
    error,
    isLoading
  } = useSWR(QUERY_KEY.revenue, () => statisticApi.getRevenueInYear(), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...options
  });

  return { revenue, error, isLoading };
}
