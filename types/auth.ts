import { User } from '@/models';

export enum Provider {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK'
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OAuthLoginPayload {
  email: string;
  name?: string;
  avatar?: string;
  phoneNumber?: string;
  provider: Provider;
  tokenExpiredDate: Date;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  role?: 'CUSTOMER' | 'ORGANIZER';
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
