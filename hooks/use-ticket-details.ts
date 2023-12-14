import { ticketApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useTicketDetails(options?: Partial<SWRConfiguration>) {
  const {
    data: ticketDetails,
    error,
    isLoading
  } = useSWR(QUERY_KEY.ticketDetails, () => ticketApi.getAllTicketDetails(), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...options
  });

  return { ticketDetails, error, isLoading };
}
