import { refreshToken, signIn, signUp } from '@/apis';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import { LoginPayload } from '@/types';
import { removeCookie, setCookie } from '@/utils';

export function useAuth() {
  async function logIn(payload: LoginPayload) {
    const { user, accessToken, refreshToken } = await signIn(payload);
    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);
    return { user };
  }

  function logOut() {
    removeCookie(ACCESS_TOKEN);
    removeCookie(REFRESH_TOKEN);
    localStorage.clear();
  }

  return { logIn, signUp, logOut, refreshToken };
}
