import { ticketApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useTickets(options?: Partial<SWRConfiguration>) {
  const {
    data: tickets,
    error,
    isLoading
  } = useSWR(QUERY_KEY.tickets, () => ticketApi.getAllTickets(), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...options
  });

  return { tickets, error, isLoading };
}
