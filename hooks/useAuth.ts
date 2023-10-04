import { refreshToken, signIn, signInWithGoogle, signUp } from '@/apis';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import { useAuthStore } from '@/stores';
import { LoginPayload, LoginWithGooglePayload } from '@/types';
import { removeCookie, setCookie } from '@/utils';
import { signIn as nextAuthSignIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useProfile } from '.';

export function useAuth() {
  const { profileMutate } = useProfile();
  const { reset } = useAuthStore();
  const { data: session } = useSession();

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

  async function logInWithGoogle() {
    try {
      await nextAuthSignIn('google');
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    (async () => {
      if (session?.user) {
        const payload: LoginWithGooglePayload = {
          email: session.user.email!,
          name: session.user.name!,
          tokenExpiredDate: new Date(session.expires)
        };
        if (Boolean(session.user.image)) payload.avatar = session.user.image!;

        const { user: loginUser, accessToken } =
          await signInWithGoogle(payload);

        setCookie(ACCESS_TOKEN, accessToken);
        profileMutate(loginUser);
      }
    })();
  }, [session?.user]);

  return { logIn, signUp, logOut, refreshToken, logInWithGoogle };
}
