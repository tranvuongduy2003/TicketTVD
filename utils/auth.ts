import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import { getCookie } from './session';

export const getAccessToken = () => {
  return getCookie(ACCESS_TOKEN) || '';
};

export const getRefreshToken = () => {
  return getCookie(REFRESH_TOKEN) || '';
};
