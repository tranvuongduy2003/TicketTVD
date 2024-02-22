import { paymentApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR, { SWRConfiguration } from 'swr';

export function useMyTickets(
  userId: string,
  options?: Partial<SWRConfiguration>
) {
  const {
    data: myTickets,
    mutate,
    error
  } = useSWR(
    QUERY_KEY.myTickets,
    async () => {
      const { data } = await paymentApi.getMyTickets(userId);
      return data;
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  return { myTickets, mutate, error, isLoading: !error && !myTickets };
}
