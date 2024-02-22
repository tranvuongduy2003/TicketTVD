import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { User } from '@/models';
import { LoginPayload, LoginResponse, SignUpPayload } from '@/types';

export const authApi = {
  getUserProfile: () => {
    return httpRequest.get<User>(API_ROUTE.auth + '/profile');
  },

  signIn: (data: LoginPayload) => {
    return httpRequest.post<LoginResponse, LoginPayload>(
      API_ROUTE.auth + '/login',
      data
    );
  },

  signUp: (data: SignUpPayload) => {
    return httpRequest.post<any, SignUpPayload>(
      API_ROUTE.auth + '/register',
      data
    );
  },

  refreshToken: (data: { refreshToken: string }) => {
    return httpRequest.post<string, { refreshToken: string }>(
      API_ROUTE.auth + '/refresh-token',
      data
    );
  }
};
