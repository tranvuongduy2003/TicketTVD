import { getUserProfile } from '@/apis';
import { MILLISECOND_PER_HOUR, QUERY_KEY } from '@/constants';
import { useAuthStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useProfile() {
  const { setProfile } = useAuthStore();
  // const queryClient = useQueryClient();

  // const { mutate: profileMutate } = useMutation<
  //   User | null,
  //   unknown,
  //   User | null
  // >({
  //   mutationFn: user => {
  //     return new Promise(resolve => resolve(user));
  //   },
  //   retry: false,
  //   cacheTime: Infinity,
  //   onSuccess: data => {
  //     useQueryClient().setQueryData([QUERY_KEY.profile], data);
  //     useAuthStore().setProfile(data!);
  //   }
  // });

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

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile]);

  return { profile };
}
