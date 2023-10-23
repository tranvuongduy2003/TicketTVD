import { refreshToken, signIn, signUp } from '@/apis';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import { useAuthStore } from '@/stores';
import { LoginPayload } from '@/types';
import { setCookie } from '@/utils';

export function useAuth() {
  const { setProfile } = useAuthStore();

  async function logIn(payload: LoginPayload) {
    const { user, accessToken, refreshToken } = await signIn(payload);

    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);
    setProfile(user);
  }

  return {
    logIn,
    signUp,
    refreshToken
  };
}
