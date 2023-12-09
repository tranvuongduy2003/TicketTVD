import { statisticApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useEventsByCategory(options?: Partial<SWRConfiguration>) {
  const {
    data: eventStatistic,
    error,
    isLoading
  } = useSWR(
    QUERY_KEY.eventStatistic,
    () => statisticApi.getEventsByCategory(),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  return { eventStatistic, error, isLoading };
}
