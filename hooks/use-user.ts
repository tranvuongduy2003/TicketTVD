import { userApi } from '@/apis';
import { MILLISECOND_PER_HOUR, QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useUser(id: string, options?: Partial<SWRConfiguration>) {
  const {
    data: user,
    isLoading,
    error,
    mutate
  } = useSWR([QUERY_KEY.user, id], () => userApi.getUserById(id), {
    dedupingInterval: MILLISECOND_PER_HOUR,
    ...options
  });

  return { user, error, isLoading, mutate };
}
