import { paymentApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function usePaymentsByEventId(
  eventId?: number,
  options?: Partial<SWRConfiguration>
) {
  const {
    data: payments,
    error,
    isLoading
  } = useSWR(
    [QUERY_KEY.payments, eventId],
    () => paymentApi.getPaymentsByEventId(eventId!),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  return { payments, error, isLoading };
}
