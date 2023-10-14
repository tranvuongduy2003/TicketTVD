import { refreshToken, signIn, signInOAuth, signUp } from '@/apis';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import { useAuthStore } from '@/stores';
import { LoginPayload, OAuthLoginPayload } from '@/types';
import { removeCookie, setCookie } from '@/utils';
import { signIn as nextAuthSignIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useAuth() {
  // const { setPro } = useProfile();
  const { reset, setProfile } = useAuthStore();
  const { data: session } = useSession();

  async function logIn(payload: LoginPayload) {
    const { user, accessToken, refreshToken } = await signIn(payload);

    setCookie(ACCESS_TOKEN, accessToken);
    setCookie(REFRESH_TOKEN, refreshToken);
    setProfile(user);
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

  async function logInWithFacebook() {
    try {
      await nextAuthSignIn('facebook');
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    (async () => {
      if (session?.user) {
        const payload: OAuthLoginPayload = {
          email: session.user.email!,
          name: session.user.name!,
          provider: (session as any).provider.toUpperCase(),
          tokenExpiredDate: new Date(session.expires!)
        };
        if (Boolean(session.user.image)) payload.avatar = session.user.image!;
        const { user: loginUser, accessToken } = await signInOAuth(payload);

        setCookie(ACCESS_TOKEN, accessToken);
        setProfile(loginUser);
      }
    })();
  }, [session?.user]);

  return {
    logIn,
    signUp,
    logOut,
    refreshToken,
    logInWithGoogle,
    logInWithFacebook
  };
}
