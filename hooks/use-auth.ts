import { authApi } from '@/apis';
import {
  ACCESS_TOKEN,
  MILLISECOND_PER_HOUR,
  QUERY_KEY,
  REFRESH_TOKEN
} from '@/constants';
import { useProfileStore } from '@/stores';
import { LoginPayload } from '@/types';
import { handleLogOut, setCookie } from '@/utils';
import Router from 'next/router';
import useSWR, { SWRConfiguration } from 'swr';

export function useAuth(options?: Partial<SWRConfiguration>) {
  const { setProfile } = useProfileStore();

  const {
    mutate,
    data: profile,
    isLoading,
    error
  } = useSWR(QUERY_KEY.profile, () => authApi.getUserProfile(), {
    dedupingInterval: MILLISECOND_PER_HOUR,
    onSuccess: user => {
      setProfile(user);
    },
    ...options
  });

  async function logIn(payload: LoginPayload) {
    const { user, accessToken, refreshToken } = await authApi.signIn(payload);

    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);

    await mutate(user, false);
  }

  async function logOut() {
    handleLogOut();
    await mutate(null!, false);
    Router.push('/auth/login');
  }

  return {
    error,
    isLoading,
    profile,
    logIn,
    logOut,
    signUp: authApi.signUp
  };
}
