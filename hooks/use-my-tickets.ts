import { paymentApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

export function useMyTickets(
  userId?: string,
  options?: Partial<SWRConfiguration>
) {
  const [searchValue, setSearchValue] = useState<string>();

  const {
    data: myTickets,
    mutate,
    error,
    isLoading
  } = useSWR(QUERY_KEY.myTickets, () => paymentApi.getMyTickets(userId!), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...options
  });

  useEffect(() => {
    mutate();
  }, [searchValue]);

  return { myTickets, setSearchValue, error, isLoading };
}
