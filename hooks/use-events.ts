import { eventApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useEvents(
  organizerId?: string,
  options?: Partial<SWRConfiguration>
) {
  const {
    data: events,
    error,
    isLoading
  } = useSWR(
    QUERY_KEY.events,
    () =>
      organizerId
        ? eventApi.getEventsByOrganizerId(organizerId)
        : eventApi.getEvents(),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  return { events, error, isLoading };
}
