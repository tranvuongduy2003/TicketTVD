import { userApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useUsers(options?: Partial<SWRConfiguration>) {
  const {
    data: users,
    error,
    isLoading
  } = useSWR(QUERY_KEY.users, () => userApi.getUsers(), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    keepPreviousData: true,
    ...options
  });

  return { users, error, isLoading };
}
