import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { User } from '@/models';
import {
  LoginPayload,
  LoginResponse,
  OAuthLoginPayload,
  SignUpPayload
} from '@/types';

export const getUserProfile = () => {
  return httpRequest.get<User>(API_ROUTE.auth + '/profile');
};

export const signIn = (data: LoginPayload) => {
  return httpRequest.post<LoginResponse, LoginPayload>(
    API_ROUTE.auth + '/login',
    data
  );
};

export const signInOAuth = (data: OAuthLoginPayload) => {
  return httpRequest.post<LoginResponse, OAuthLoginPayload>(
    API_ROUTE.auth + '/login/oauth',
    data
  );
};

export const signUp = (data: SignUpPayload) => {
  return httpRequest.post<any, SignUpPayload>(
    API_ROUTE.auth + '/register',
    data
  );
};

export const refreshToken = () => {
  return httpRequest.post(API_ROUTE.auth + '/refresh-token', null);
};
