import { useAppStore, useAuthStore } from '@/stores';
import axios from 'axios';

export const logOut = () => {
  const setIsLoading = useAppStore.getState().setIsLoading;
  const reset = useAuthStore.getState().reset;

  setIsLoading(true);
  reset();

  setIsLoading(false);
};

export const getAccessToken = () => {
  const token = useAuthStore.getState().token.accessToken;
  return token;
};

export const getRefreshToken = () => {
  const token = useAuthStore.getState().token.refreshToken;
  return token;
};

export const handleRefreshToken = async () => {
  const refreshToken = getRefreshToken();
  const { data } = await axios.post('/auth/refresh', {
    baseURL: process.env.API_URL,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`
    }
  });
  const { token } = data.data;
  const setToken = useAuthStore.getState().setToken;
  setToken({ refreshToken, accessToken: token });
  return token;
};
