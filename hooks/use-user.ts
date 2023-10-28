import { userApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useUser(id: string, options?: Partial<SWRConfiguration>) {
  const {
    data: user,
    error,
    isLoading
  } = useSWR([QUERY_KEY.user, id], () => userApi.getUserById(id), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    errorRetryCount: 3,
    ...options
  });

  return { user, error, isLoading };
}
