import { authApi } from '@/apis';
import {
  ACCESS_TOKEN,
  MILLISECOND_PER_HOUR,
  QUERY_KEY,
  REFRESH_TOKEN
} from '@/constants';
import { useAuthStore } from '@/stores';
import { LoginPayload } from '@/types';
import { getAccessToken, handleLogOut, setCookie } from '@/utils';
import { useEffect } from 'react';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useAuth(options?: Partial<SWRConfiguration>) {
  const { setProfile, reset } = useAuthStore();

  const {
    data: profile,
    isLoading,
    error,
    mutate
  } = useSWR(QUERY_KEY.profile, () => authApi.getUserProfile(), {
    dedupingInterval: MILLISECOND_PER_HOUR,
    revalidateOnFocus: false,
    onSuccess: data => {
      setProfile(data);
    },
    ...options
  });

  async function logIn(payload: LoginPayload) {
    const { user, accessToken, refreshToken } = await authApi.signIn(payload);

    setProfile(user);

    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);

    await mutate(user, false);
  }

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!Boolean(accessToken)) {
      logOut();
    }
  }, []);

  function logOut() {
    reset();
    handleLogOut();
    mutate(null!, false);
  }

  return {
    isLoading,
    profile,
    error,
    logIn,
    logOut,
    signUp: authApi.signUp
  };
}
