import { getUsers } from '@/apis/user.api';
import { QUERY_KEY } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  const getListUsers = useQuery([QUERY_KEY.users], () => getUsers(), {
    refetchOnMount: true,
    keepPreviousData: true
  });
  return getListUsers;
};
