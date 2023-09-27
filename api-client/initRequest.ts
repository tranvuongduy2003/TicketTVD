import {
  getAccessToken,
  getRefreshToken,
  handleRefreshToken,
  logOut
} from '@/utils';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios';

const requestConfig: AxiosRequestConfig = {
  baseURL: process.env.API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export type IConfig = AxiosRequestConfig;

export const axiosInstance = axios.create(requestConfig);

export default function initRequest() {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error.response?.data);
    }
  );

  axiosInstance.interceptors.response.use(
    (res: any) => {
      return res.data;
    },
    async (error: any) => {
      const statusCode = error.response?.data?.statusCode;
      const originalConfig = error.config;

      switch (statusCode) {
        case 401: {
          const rfToken = getRefreshToken();
          if (!originalConfig._retry && rfToken) {
            originalConfig._retry = true;
            try {
              console.log('retry');
              const token = await handleRefreshToken();
              axios.defaults.headers.common = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              };
              return axiosInstance(originalConfig);
            } catch (error: any) {
              logOut();
            }
          } else {
            logOut();
          }
          break;
        }
        case 403: {
          logOut();
          break;
        }
        case 500: {
          break;
        }
        default:
          break;
      }
      return Promise.reject(error.response?.data);
    }
  );
}

initRequest();
