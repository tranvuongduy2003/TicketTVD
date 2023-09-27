export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}
