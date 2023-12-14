import { paymentApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function usePaymentsByUserId(
  userId?: string,
  options?: Partial<SWRConfiguration>
) {
  const {
    data: payments,
    error,
    isLoading
  } = useSWR(
    [QUERY_KEY.payments, 'user', userId],
    () => paymentApi.getPaymentsByUserId(userId!),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  return { payments, error, isLoading };
}
