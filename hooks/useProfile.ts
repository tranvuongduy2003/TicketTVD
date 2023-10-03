import { getUserProfile } from '@/apis';
import { MILLISECOND_PER_HOUR, QUERY_KEY } from '@/constants';
import { User } from '@/models';
import { useAuthStore } from '@/stores';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfile() {
  const { setProfile } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate: profileMutate, ...rest } = useMutation<
    User | null,
    unknown,
    User | null
  >({
    mutationFn: user => {
      return new Promise(resolve => resolve(user));
    },
    retry: false,
    cacheTime: Infinity,
    onSuccess: data => {
      queryClient.setQueryData([QUERY_KEY.profile], data);
      setProfile(data!);
    }
  });

  const { data: profile } = useQuery({
    queryKey: [QUERY_KEY.profile],
    queryFn: () => getUserProfile(),
    retry: false,
    staleTime: 8 * MILLISECOND_PER_HOUR,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  return { profile, profileMutate };
}
