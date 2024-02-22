import { eventApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useEvent(id: string, options?: Partial<SWRConfiguration>) {
  const {
    data: event,
    error,
    mutate
  } = useSWR(
    [QUERY_KEY.event, id],
    async () => {
      const { data } = await eventApi.getEventById(id);
      return data;
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...options
    }
  );

  return { event, mutate, error, isLoading: !error && !event };
}
