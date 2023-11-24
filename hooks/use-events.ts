import { eventApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useEvents(
  organizerId?: string,
  options?: Partial<SWRConfiguration>
) {
  const [searchValue, setSearchValue] = useState<string>();

  const {
    data: events,
    mutate,
    error,
    isLoading
  } = useSWR(
    QUERY_KEY.events,
    () =>
      organizerId
        ? eventApi.getEventsByOrganizerId(organizerId)
        : eventApi.getEvents(searchValue),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  useEffect(() => {
    mutate();
  }, [searchValue]);

  return { events, setSearchValue, error, isLoading };
}
