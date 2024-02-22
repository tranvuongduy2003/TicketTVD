import { eventApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useUpcomingEvents(options?: Partial<SWRConfiguration>) {
  const {
    data: events,
    error,
    mutate
  } = useSWR(
    [QUERY_KEY.events, 'upcoming'],
    async () => {
      const { data } = await eventApi.getUpcomingEvents();
      return data;
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options
    }
  );

  return { events, mutate, error, isLoading: !error && !events };
}
