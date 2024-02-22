import { eventApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useNewestEvents(options?: Partial<SWRConfiguration>) {
  const {
    data: events,
    error,
    mutate
  } = useSWR(
    [QUERY_KEY.events, 'newest'],
    async () => {
      const { data } = await eventApi.getNewestEvents();
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
