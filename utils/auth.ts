import { ACCESS_TOKEN, QUERY_KEY, REFRESH_TOKEN } from '@/constants';
import { useQueryClient } from '@tanstack/react-query';
import { getCookie, removeCookie } from './session';

export const logOut = () => {
  useQueryClient().setQueryData([QUERY_KEY.profile], null);
  removeCookie(ACCESS_TOKEN);
  removeCookie(REFRESH_TOKEN);
  localStorage.clear();
};

export const getAccessToken = () => {
  return getCookie(ACCESS_TOKEN) || '';
};

export const getRefreshToken = () => {
  return getCookie(REFRESH_TOKEN) || '';
};
