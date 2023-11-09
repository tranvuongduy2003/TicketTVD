import { authApi } from '@/apis';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import Router from 'next/router';
import { getCookie, removeCookie, setCookie } from './session';

export const getAccessToken = () => {
  return getCookie(ACCESS_TOKEN) || '';
};

export const getRefreshToken = () => {
  return getCookie(REFRESH_TOKEN) || '';
};

export function logOut() {
  removeCookie(ACCESS_TOKEN);
  removeCookie(REFRESH_TOKEN);
  localStorage.clear();
  Router.push('/auth/login');
}

export async function handleRefreshToken() {
  const refreshToken = getRefreshToken();
  const newToken = await authApi.refreshToken({
    refreshToken: refreshToken!
  });

  setCookie(ACCESS_TOKEN, newToken);

  return newToken;
}

export function handleLogOut() {
  removeCookie(ACCESS_TOKEN);
  removeCookie(REFRESH_TOKEN);
  localStorage.clear();
}
