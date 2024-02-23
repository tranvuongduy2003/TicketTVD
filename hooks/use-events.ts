import { eventApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import { EventFilter, FilteringOptions } from '@/models';
import { useEffect } from 'react';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useEvents(
  filter?: Partial<EventFilter>,
  options?: Partial<SWRConfiguration>
) {
  const { data, mutate, error } = useSWR(
    QUERY_KEY.events,
    async () => {
      const { data, meta } = await eventApi.getEvents(filter);
      return { events: data, meta };
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  useEffect(() => {
    mutate();
  }, [
    filter?.order,
    filter?.page,
    filter?.size,
    filter?.search,
    filter?.takeAll,
    filter?.categoryKeys,
    filter?.price,
    filter?.time,
    mutate
  ]);

  return {
    events: data?.events,
    meta: data?.meta,
    mutate,
    error,
    isLoading: !error && !data
  };
}
