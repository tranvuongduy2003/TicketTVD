import { eventApi, statisticApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useEventsStatisticByOrganizer(
  organizerId: string,
  options?: Partial<SWRConfiguration>
) {
  const {
    data: eventsStatistic,
    error,
    mutate
  } = useSWR(
    QUERY_KEY.eventsStatistic,
    async () => {
      const { data } =
        await statisticApi.getEventsStatisticByOrganizer(organizerId);
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
    eventsStatistic,
    mutate,
    error,
    isLoading: !error && !eventsStatistic
  };
}
