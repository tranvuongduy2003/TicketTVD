import { authApi } from '@/apis';
import {
  ACCESS_TOKEN,
  MILLISECOND_PER_HOUR,
  QUERY_KEY,
  REFRESH_TOKEN
} from '@/constants';
import { useAuthStore } from '@/stores';
import { LoginPayload } from '@/types';
import { getCookie, removeCookie, setCookie } from '@/utils';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useAuth(options?: Partial<SWRConfiguration>) {
  const { setProfile, reset } = useAuthStore();

  const {
    data: profile,
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

    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);

    await mutate(user, false);
  }

  async function handleRefreshToken() {
    const refreshToken = getCookie(REFRESH_TOKEN);
    const newToken = await authApi.refreshToken({
      refreshToken: refreshToken!
    });

    setCookie(ACCESS_TOKEN, newToken);

    return newToken;
  }

  function logOut() {
    reset();
    removeCookie(ACCESS_TOKEN);
    removeCookie(REFRESH_TOKEN);
    localStorage.clear();
    mutate(null!, false);
  }

  return {
    profile,
    error,
    logIn,
    logOut,
    signUp: authApi.signUp,
    handleRefreshToken
  };
}
