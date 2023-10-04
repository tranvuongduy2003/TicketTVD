import { User } from '@/models';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginWithGooglePayload {
  email: string;
  name: string;
  avatar?: string;
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
