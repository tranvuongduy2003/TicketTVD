import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { User } from '@/models';
import { LoginPayload, LoginResponse, SignUpPayload } from '@/types';

export const authApi = {
  getUserProfile: () => {
    return httpRequest.get<User>(API_ROUTE.auth + '/profile', {
      baseURL: process.env.AUTH_API_URL
    });
  },

  signIn: (data: LoginPayload) => {
    return httpRequest.post<LoginResponse, LoginPayload>(
      API_ROUTE.auth + '/login',
      data,
      { baseURL: process.env.AUTH_API_URL }
    );
  },

  signUp: (data: SignUpPayload) => {
    return httpRequest.post<any, SignUpPayload>(
      API_ROUTE.auth + '/register',
      data,
      { baseURL: process.env.AUTH_API_URL }
    );
  },

  refreshToken: (data: { refreshToken: string }) => {
    return httpRequest.post<string, { refreshToken: string }>(
      API_ROUTE.auth + '/refresh-token',
      data,
      { baseURL: process.env.AUTH_API_URL }
    );
  }
};
