import { useAuth } from '@/hooks';
import { ApiResponse } from '@/models';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

const requestConfig: AxiosRequestConfig = {
  baseURL: '/api',
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
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error.response?.data);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      return response.data.data;
    },
    async (error: any) => {
      const statusCode = error.response?.data?.statusCode;
      const originalConfig = error.config;

      switch (statusCode) {
        case 401: {
          if (!originalConfig._retry) {
            originalConfig._retry = true;
            try {
              console.log('retry');
              await useAuth().refreshToken();
            } catch (error: any) {
              useAuth().logOut();
            }
          } else {
            useAuth().logOut();
          }
          break;
        }
        case 403: {
          useAuth().logOut();
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
