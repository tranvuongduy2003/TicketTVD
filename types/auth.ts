import { User } from '@/models';

export interface LoginPayload {
  email: string;
  password: string;
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
