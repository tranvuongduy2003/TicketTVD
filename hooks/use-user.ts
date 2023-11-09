import { userApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useUser(id: string, options?: Partial<SWRConfiguration>) {
  const { data: user, error } = useSWR(
    [QUERY_KEY.user, id],
    () => userApi.getUserById(id),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: false,
      ...options
    }
  );

  const isLoading = user === undefined && error === undefined;

  return { user, error, isLoading };
}
