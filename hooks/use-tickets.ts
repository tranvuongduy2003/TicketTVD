import { ticketApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import { FilteringOptions } from '@/models';
import { useEffect } from 'react';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useTickets(
  filter?: Partial<FilteringOptions>,
  options?: Partial<SWRConfiguration>
) {
  const {
    data: tickets,
    error,
    mutate
  } = useSWR(
    QUERY_KEY.tickets,
    async () => {
      const { data } = await ticketApi.getAllTickets(filter);
      return data;
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
    mutate
  ]);

  return { tickets, mutate, error, isLoading: !error && !tickets };
}
