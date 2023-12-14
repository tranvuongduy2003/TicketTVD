import { paymentApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function usePayments(options?: Partial<SWRConfiguration>) {
  const {
    data: payments,
    error,
    isLoading
  } = useSWR(QUERY_KEY.payments, () => paymentApi.getAllPayments(), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...options
  });

  return { payments, error, isLoading };
}
