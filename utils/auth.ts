import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import Router from 'next/router';
import { getCookie, removeCookie } from './session';

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
