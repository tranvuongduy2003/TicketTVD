import { LoginResponse } from '@/types';
import Cookies from 'cookies';
import httpProxy, { ProxyResCallback } from 'http-proxy';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false
  }
};

const proxy = httpProxy.createProxyServer();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'method not supported' });
  }

  return new Promise(resolve => {
    req.headers.cookie = '';

    const handleLoginResponse: ProxyResCallback = proxyRes => {
      let body = '';

      proxyRes.on('data', function (chunk) {
        body += chunk;
      });

      proxyRes.on('end', function () {
        try {
          const { user, accessToken, refreshToken } = JSON.parse(
            body
          ) as LoginResponse;

          const cookies = new Cookies(req, res, {
            secure: process.env.NODE_ENV !== 'development'
          });

          cookies.set('access_token', accessToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(accessToken.expiredAt)
          });

          cookies.set('refresh_token', refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(refreshToken.expiredAt)
          });

          (res as NextApiResponse)
            .status(200)
            .json({ user: user, message: 'login successfully' });
        } catch (error) {
          (res as NextApiResponse)
            .status(500)
            .json({ message: 'something went wrong' });
        }

        resolve(true);
      });
    };

    proxy.once('proxyRes', handleLoginResponse);
    proxy.web(req, res, {
      target: process.env.API_URL,
      changeOrigin: true,
      selfHandleResponse: true
    });
  });
}
