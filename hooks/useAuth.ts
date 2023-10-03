import { refreshToken, signIn, signUp } from '@/apis';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import { useAuthStore } from '@/stores';
import { LoginPayload } from '@/types';
import { removeCookie, setCookie } from '@/utils';
import { useProfile } from '.';

export function useAuth() {
  const { profileMutate } = useProfile();
  const { reset } = useAuthStore();

  async function logIn(payload: LoginPayload) {
    const { user, accessToken, refreshToken } = await signIn(payload);
    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);
    profileMutate(user);
    return { user };
  }

  function logOut() {
    reset();
    removeCookie(ACCESS_TOKEN);
    removeCookie(REFRESH_TOKEN);
    localStorage.clear();
  }

  return { logIn, signUp, logOut, refreshToken };
}
