import cookie from 'js-cookie';
import JwtDecode, { JwtPayload } from 'jwt-decode';
import nextCookie from 'next-cookies';

export const getCookieFromBrowser = (key: string) => cookie.get(key);

const getCookieFromServer = (ctx: any, key: string) => {
  const specifiKey = key;
  const cookieServer = nextCookie(ctx);
  const token =
    cookieServer && cookieServer[specifiKey] ? cookieServer[specifiKey] : false;
  if (!token) return null;
  return token;
};

export const getCookie = (key: string, context = {}) =>
  typeof window !== 'undefined'
    ? getCookieFromBrowser(key)
    : getCookieFromServer(context, key);

export const setCookie = (key: string, token: string) => {
  const { exp } = JwtDecode(token) as JwtPayload;

  cookie.set(key, token, {
    expires: exp,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV !== 'development'
  });
};

export const removeCookie = (key: string) => {
  cookie.remove(key);
};
