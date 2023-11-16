import { eventApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useEvent(id: number, options?: Partial<SWRConfiguration>) {
  const { data: event, error } = useSWR(
    [QUERY_KEY.event, id],
    () => eventApi.getEventById(id),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: false,
      ...options
    }
  );

  const isLoading = event === undefined && error === undefined;

  return { event, error, isLoading };
}
