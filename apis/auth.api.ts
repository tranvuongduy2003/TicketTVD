import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { User } from '@/models';
import { LoginPayload, LoginResponse, SignUpPayload } from '@/types';

export const getUserProfile = () => {
  return httpRequest.get<User>('/profile');
};

export const signIn = (data: LoginPayload) => {
  return httpRequest.post<LoginResponse, LoginPayload>(
    API_ROUTE.auth + '/login',
    data
  );
};

export const signUp = (data: SignUpPayload) => {
  return httpRequest.post<any, SignUpPayload>(
    API_ROUTE.auth + '/sign-up',
    data
  );
};

export const signOut = () => {
  return httpRequest.post(API_ROUTE.auth + '/logout', null);
};

export const refreshToken = () => {
  return httpRequest.post(API_ROUTE.auth + '/refresh-token', null);
};
