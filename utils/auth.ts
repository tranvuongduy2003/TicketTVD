import { authApi } from '@/apis';
import { ACCESS_TOKEN, QUERY_KEY, REFRESH_TOKEN } from '@/constants';
import Router from 'next/router';
import { getCookie, removeCookie, setCookie } from './session';
import { mutate } from 'swr';

export const getAccessToken = () => {
  return getCookie(ACCESS_TOKEN) || '';
};

export const getRefreshToken = () => {
  return getCookie(REFRESH_TOKEN) || '';
};

export async function handleRefreshToken() {
  const refreshToken = getRefreshToken();
  const newToken = await authApi.refreshToken({
    refreshToken: refreshToken!
  });

  setCookie(ACCESS_TOKEN, newToken);

  return newToken;
}

export function handleLogOut() {
  mutate(QUERY_KEY.profile, null, false);
  removeCookie(ACCESS_TOKEN);
  removeCookie(REFRESH_TOKEN);
  localStorage.clear();
}
