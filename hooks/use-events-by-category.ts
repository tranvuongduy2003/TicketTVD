import { statisticApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useEventsByCategory(options?: Partial<SWRConfiguration>) {
  const {
    data: eventStatistic,
    error,
    mutate
  } = useSWR(
    QUERY_KEY.eventStatisticByCategory,
    async () => {
      const { data } = await statisticApi.getEventsByCategory();
      return data;
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  return {
    eventStatistic,
    mutate,
    error,
    isLoading: !error && !eventStatistic
  };
}
